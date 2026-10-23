const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

// ----------------------------------------------------
// Start Scan Session
// ----------------------------------------------------

export async function startScan(examId) {

    const response = await fetch(
        `${API_URL}/start-scan`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                exam_id: examId
            })
        }
    );

    if (!response.ok) {
        throw new Error(await response.text());
    }

    return await response.json();
}


// ----------------------------------------------------
// Upload Captured Page
// ----------------------------------------------------

export async function uploadPage(
    sessionId,
    pageNumber,
    imageBlob
) {

    const formData = new FormData();

    formData.append(
        "session_id",
        sessionId
    );

    formData.append(
        "page_number",
        pageNumber
    );

    formData.append(
        "image",
        imageBlob,
        `page_${pageNumber}.jpg`
    );

    const response = await fetch(
        `${API_URL}/capture-page`,
        {
            method: "POST",
            body: formData
        }
    );

    if (!response.ok) {
        throw new Error(await response.text());
    }

    return await response.json();
}


// ----------------------------------------------------
// Detect Paper
// ----------------------------------------------------

export async function detectPaper(imageBlob) {

    const formData = new FormData();

    formData.append(
        "image",
        imageBlob,
        "frame.jpg"
    );

    const response = await fetch(
        `${API_URL}/detect-paper`,
        {
            method: "POST",
            body: formData
        }
    );

    if (!response.ok) {
        throw new Error(await response.text());
    }

    return await response.json();
}


// ----------------------------------------------------
// Check OCR Processing Status
// ----------------------------------------------------

export async function getScanStatus(sessionId) {

    const response = await fetch(
        `${API_URL}/scan-status/${sessionId}`
    );

    if (!response.ok) {
        throw new Error(await response.text());
    }

    return await response.json();
}


// ----------------------------------------------------
// Finish Scan & Start Evaluation
// ----------------------------------------------------

export async function finishScan(sessionId) {

    const response = await fetch(
        `${API_URL}/finish-scan`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                session_id: sessionId
            })
        }
    );

    if (!response.ok) {
        throw new Error(await response.text());
    }

    return await response.json();
}