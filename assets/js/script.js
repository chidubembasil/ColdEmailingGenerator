
async function callOllama(prompt) {
    try {
    const response = await fetch("http://127.0.0.1:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
        model: "qwen:latest",
        prompt: prompt,
        stream: false
        })
    });

    if (!response.ok) throw new Error(`Server error: ${response.statusText}`);
    const data = await response.json();
    return data.response.trim();
    } catch (err) {
    alert("Error contacting Ollama AI server. Ensure it is running on localhost:11434.");
    console.error(err);
    return null;
    }
}

async function generateEmail() {
    const purpose = document.getElementById("emailPurpose").value.trim();
    const tone = document.getElementById("emailTone").value;
    const keyPoints = document.getElementById("keyPoints").value.trim();

    if (!purpose) {
    alert("Please enter the email purpose.");
    return;
    }

    const prompt = `
Generate a ${tone} email for the following purpose: "${purpose}".
Include these key points: ${keyPoints || "none"}.
Make it clear, concise, and professional.
Return only the email body text.
    `.trim();

    const output = document.getElementById("emailOutput");
    output.textContent = "Generating email... Please wait.";
    output.setAttribute("contenteditable", "false");

    const emailText = await callOllama(prompt);

    if (!emailText) {
    output.textContent = "Failed to generate email.";
    return;
    }

    output.textContent = emailText;
}

function downloadEmail() {
    const emailText = document.getElementById("emailOutput").textContent.trim();
    if (!emailText || emailText === "Generating email... Please wait.") {
    alert("Please generate an email first.");
    return;
    }
    const blob = new Blob([emailText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "generated-email.txt";
    a.click();
    URL.revokeObjectURL(url);
}

// function sendEmail() {
//   const senderName = document.getElementById("senderName").value.trim();
//   const senderEmail = document.getElementById("senderEmail").value.trim();
//   const receiverEmail = document.getElementById("receiverEmail").value.trim();
//   const emailContent = document.getElementById("emailOutput").textContent.trim();

//   if (!senderName || !senderEmail || !receiverEmail || !emailContent) {
//     alert("Please fill in all fields and generate the email first.");
//     return;
//   }

//   const templateParams = {
//     from_name: senderName,
//     from_email: senderEmail,
//     to_email: receiverEmail,
//     message: emailContent
//   };

//   emailjs.send("service_yusqfox","template_wl9r3tg", templateParams)
//     .then(function(response) {
//       alert("Email sent successfully!");
//     }, function(error) {
//       console.error("Failed to send email:", error);
//       alert("Error sending email. Please check your EmailJS setup.");
//     });
// }

function enableEdit() {
    const output = document.getElementById("emailOutput");
    output.setAttribute("contenteditable", "true");
    document.getElementById("saveButton").classList.remove("hidden");
}

function saveEditedEmail() {
    const output = document.getElementById("emailOutput");
    output.setAttribute("contenteditable", "false");
    document.getElementById("saveButton").classList.add("hidden");
    alert("Edits saved.");
}