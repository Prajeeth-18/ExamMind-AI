const API_URL = "http://127.0.0.1:8000";

export async function startScan() {

    const response = await fetch(

        `${API_URL}/start-scan`,

        {

            method: "POST"

        }

    );

    return await response.json();

}


export async function uploadPage(

    sessionId,

    pageNumber,

    imageBlob

){

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

            method:"POST",

            body:formData

        }

    );

    return await response.json();

}