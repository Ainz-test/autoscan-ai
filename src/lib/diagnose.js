// ── AI diagnosis pipeline ────────────────────────────────────────────────────
// Reads an inspection-sheet image, sends it to the /api/diagnose proxy
// (Anthropic Claude), and parses the returned fault array. Logic preserved
// exactly from the original implementation.

export function buildPrompt(make, model, year) {
  return (
    "CRITICAL TASK: You are an expert automotive diagnostic engineer. Analyze this vehicle inspection sheet image COMPLETELY." +
    " Read and extract EVERY SINGLE fault, issue, check mark, X mark, circled item, handwritten note, and any indication of a problem." +
    " DO NOT skip any fault. DO NOT summarize multiple faults into one. List EACH fault as a SEPARATE item." +
    " Your response must be ONLY a raw JSON array starting with [ and ending with ]." +
    " No markdown, no code blocks, no explanation, no text before or after the JSON array." +
    " Vehicle: " + make + " " + model + " " + year + "." +
    " Each fault object MUST have ALL these fields:" +
    " id (string, e.g. F001)," +
    " severity (MUST be exactly: high OR medium OR low)," +
    " zone (MUST be exactly one of: engine_bay, front_left_wheel, front_right_wheel, rear_left_wheel, rear_right_wheel, underbody_front, underbody_rear, cabin_dashboard, battery_electrical, fuel_system)," +
    " code (OBD2 DTC code string if present, otherwise null)," +
    " nameEn (English: component name + fault description, be specific and complete)," +
    " nameAr (Arabic: TRANSLATE nameEn to Arabic completely)," +
    " fn (English: one sentence explaining what this component does)," +
    " fnAr (Arabic: TRANSLATE fn to Arabic)," +
    " immediate (English: immediate risk if not repaired now)," +
    " immediateAr (Arabic: TRANSLATE immediate to Arabic)," +
    " longterm (English: long-term consequences and cost if ignored)," +
    " longtermAr (Arabic: TRANSLATE longterm to Arabic)," +
    " steps (array of English repair step strings, 3-5 steps)," +
    " stepsAr (array of Arabic repair step strings, TRANSLATE steps to Arabic)," +
    " cost (repair cost range, e.g. $150-$400)." +
    " Severity rules: high=safety critical do not drive, medium=repair within 2-4 weeks, low=cosmetic or minor." +
    " If no faults found or this is not an inspection sheet, return exactly: []" +
    " IMPORTANT: Return ALL faults. Do not skip any. Start response with [ end with ] ONLY."
  );
}

// Parse the raw model text into an ordered array of fault objects.
export function parseFaults(raw) {
  let faults = [];
  try {
    let clean = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
    if (clean.charAt(0) === "{") {
      const obj = JSON.parse(clean);
      clean = JSON.stringify(obj.faults || obj.results || obj.data || []);
    }
    if (clean.charAt(0) !== "[") {
      const m = clean.match(/\[[\s\S]*\]/);
      clean = m ? m[0] : "[]";
    }
    const parsed = JSON.parse(clean);
    faults = Array.isArray(parsed) ? parsed : [];
    if (faults.length === 0 && typeof parsed === "object" && parsed !== null) {
      Object.keys(parsed).forEach((k) => {
        if (Array.isArray(parsed[k]) && parsed[k].length > 0) faults = parsed[k];
      });
    }
  } catch (e) {
    const matches = raw.match(/\{[^{}]*"severity"[^{}]*\}/g);
    if (matches && matches.length > 0) {
      faults = matches
        .map((s) => {
          try {
            return JSON.parse(s);
          } catch (e2) {
            return null;
          }
        })
        .filter(Boolean);
    } else {
      throw e;
    }
  }
  const order = { high: 0, medium: 1, low: 2 };
  faults.sort((a, b) => (order[a.severity] || 3) - (order[b.severity] || 3));
  return faults;
}

// Reads file -> calls API -> returns faults. Callbacks report errors / data.
export function runDiagnosis({ imageFile, make, model, year, ar, onError, onDone }) {
  const reader = new FileReader();
  reader.onerror = () =>
    onError(ar ? "تعذّر قراءة الصورة. حاول مجدداً." : "Could not read the image. Please try again.");
  reader.onload = () => {
    const b64 = reader.result.split(",")[1];
    const mt = imageFile.type || "image/jpeg";
    const body = JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 4000,
      messages: [
        {
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: mt, data: b64 } },
            { type: "text", text: buildPrompt(make, model, year) },
          ],
        },
      ],
    });

    fetch("/api/diagnose", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    })
      .then((res) => {
        if (res.status === 404) {
          onError(ar ? "ملف api/diagnose.js غير موجود. راجع دليل الإعداد." : "API proxy missing. See setup guide Phase 6 Step 3.");
          return null;
        }
        if (!res.ok) {
          onError("Server error " + res.status + ". Check Vercel logs.");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (!data) return;
        if (data.error) {
          const msg = data.error.message || JSON.stringify(data.error);
          onError(
            msg.indexOf("credit") > -1 || msg.indexOf("billing") > -1
              ? "Add billing credit at console.anthropic.com/billing. " + msg
              : "API error: " + msg
          );
          return;
        }
        const rawText = (data.content && data.content[0] && data.content[0].text) || "";
        if (!rawText) {
          onError(ar ? "استجابة فارغة من الذكاء الاصطناعي. حاول مجدداً." : "Empty AI response. Please try again.");
          return;
        }
        let faults;
        try {
          faults = parseFaults(rawText);
        } catch (e) {
          onError(ar ? "تنسيق غير متوقع من الذكاء الاصطناعي. حاول مجدداً." : "Unexpected AI format. Please try again.");
          return;
        }
        onDone(faults);
      })
      .catch((err) => {
        onError(
          err.message && err.message.indexOf("fetch") > -1
            ? ar ? "خطأ في الشبكة. تحقق من اتصالك بالإنترنت." : "Network error. Check your connection."
            : "Unexpected error: " + err.message
        );
      });
  };
  reader.readAsDataURL(imageFile);
}
