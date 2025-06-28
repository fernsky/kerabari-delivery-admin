export function ReportCoverPage() {
  const currentYear = new Date().getFullYear();
  const nepaliYear = currentYear + 56; // Convert to Nepali year (BS)

  return (
    <div className="cover-page">
      <div style={{ textAlign: "center", marginBottom: "4cm" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2cm",
          }}
        >
          <div style={{ width: "80px", height: "80px" }}>
            {/* Nepal Government Logo placeholder */}
            <div
              style={{
                width: "80px",
                height: "80px",
                border: "2px solid #ccc",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "8pt",
                color: "#666",
              }}
            >
              नेपाल सरकार
            </div>
          </div>
          <div style={{ flexGrow: 1 }}>
            <div
              style={{
                color: "#1e3a8a",
                fontSize: "20pt",
                fontWeight: 700,
                marginBottom: "0.5em",
              }}
            >
              बुद्धशान्ति गाउँपालिका
            </div>
            <div
              style={{
                color: "#1e40af",
                fontSize: "16pt",
                fontWeight: 600,
                marginBottom: "0.5em",
              }}
            >
              गाउँकार्यपालिकाको कार्यालय
            </div>
            <div
              style={{
                color: "#1e40af",
                fontSize: "12pt",
                marginBottom: "0.5em",
              }}
            >
              बुद्धशान्ति, झापा, कोशी प्रदेश
            </div>
          </div>
          <div style={{ width: "80px", height: "80px" }}>
            {/* Municipality Logo placeholder */}
            <div
              style={{
                width: "80px",
                height: "80px",
                border: "2px solid #ccc",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "8pt",
                color: "#666",
              }}
            >
              गाउँपालिका
            </div>
          </div>
        </div>

        {/* Main Title Section */}
        <div
          style={{
            color: "#dc2626",
            padding: "1.5em",
            margin: "2cm 0",
            fontSize: "24pt",
            fontWeight: 700,
          }}
        >
          गाउँपालिका पार्श्वचित्र
        </div>

        {/* Subtitle */}
        <div
          style={{
            color: "#1e40af",
            fontSize: "18pt",
            fontWeight: 600,
            marginBottom: "1cm",
          }}
        >
          डिजिटल प्रोफाइल प्रतिवेदन
        </div>

        {/* Bottom Section */}
        <div style={{ color: "#0f172a", padding: "1em", marginTop: "1cm" }}>
          <div style={{ fontSize: "16pt", fontWeight: 600 }}>
            मस्यौदा प्रतिवेदन
          </div>
          <div style={{ fontSize: "18pt", fontWeight: 700 }}>{nepaliYear}</div>
        </div>
      </div>

      {/* Publication Info */}
      <div
        style={{
          position: "absolute",
          bottom: "2cm",
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
          fontSize: "10pt",
          color: "#64748b",
        }}
      >
        <div>प्रकाशन मिति: {nepaliYear} फागुन</div>
        <div>संस्करण: १.०</div>
      </div>
    </div>
  );
}
