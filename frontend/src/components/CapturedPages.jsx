function CapturedPages({ pages }) {

  return (

    <div style={{ marginTop: "20px" }}>

      <h2>Captured Pages</h2>

      {

        pages.length === 0 ?

        (

          <p>No pages captured yet.</p>

        )

        :

        (

          pages.map((page) => (

            <div
              key={page.pageNumber}
              style={{
                display: "flex",
                gap: "15px",
                marginBottom: "15px",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "8px"
              }}
            >

              <img
                src={page.image}
                alt={`Page ${page.pageNumber}`}
                style={{
                  width: "90px",
                  height: "120px",
                  objectFit: "cover",
                  borderRadius: "5px"
                }}
              />

              <div>

                <h3>

                  Page {page.pageNumber}

                </h3>

                <p>

                  Status :

                  {" "}

                  {page.status}

                </p>

              </div>

            </div>

          ))

        )

      }

    </div>

  );

}

export default CapturedPages;