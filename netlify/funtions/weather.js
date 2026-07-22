export default async (req) => {
    const city = new URL(req.url).searchParams.get("city");

    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!city) {
        return new Response(
            JSON.stringify({ error: "City is required" }),
            {
                status: 400,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
    }

    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`
    );

    const data = await response.json();

    return new Response(JSON.stringify(data), {
        status: response.status,
        headers: {
            "Content-Type": "application/json"
        }
    });
};
