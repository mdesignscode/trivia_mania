import { GET } from "@/app/api/status/route";

describe("GET /status", function () {
  test("Should return OK if API is running", async function () {
    // create request

    // get response
    const res = GET();
    const data = await res.json();

    expect(data.status).toStrictEqual("OK");
  });
});
