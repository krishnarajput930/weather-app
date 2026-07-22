export default async (req) => {
    const city = new URL(req.url).searchParams.get("city");

    const apiKey = Netlify.env.get("OPENWEATHER_API_KEY");

    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );

    const data = await response.json();

    return new Response(JSON.stringify(data), {
        headers: {
            "Content-Type": "application/json"
        }
    });
};
