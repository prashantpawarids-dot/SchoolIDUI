// import { NextRequest, NextResponse } from "next/server";

// // Existing GET proxy (do not touch)
// export async function GET(
//   req: NextRequest,
//   context: { params: Promise<{ path: string[] }> }
// ) {
//   const { path } = await context.params;

//   const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
//   if (!API_BASE_URL) {
//     return NextResponse.json({ error: "API_BASE_URL is undefined" }, { status: 500 });
//   }

//   const targetUrl = `${API_BASE_URL}/${path.join("/")}${req.nextUrl.search}`;

//   try {
//     const response = await fetch(targetUrl, { method: "GET" });
//     const text = await response.text();

//     if (text.trim().startsWith("<")) {
//       return NextResponse.json(
//         { error: "Backend returned HTML instead of JSON", targetUrl },
//         { status: 502 }
//       );
//     }

//     return NextResponse.json(JSON.parse(text));
//   } catch (err) {
//     console.error("🔴 PROXY ERROR:", err);
//     return NextResponse.json({ error: "Proxy crashed" }, { status: 500 });
//   }
// }

// // ✅ Add POST handler only for login
// export async function POST(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
//   const { path } = await context.params;
//   const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

//   if (!API_BASE_URL) {
//     return NextResponse.json({ error: "API_BASE_URL is undefined" }, { status: 500 });
//   }

//   const targetUrl = `${API_BASE_URL}/${path.join("/")}`;

//   // Only allow POST for login route
//   if (!targetUrl.includes("/Auth/login")) {
//     return NextResponse.json(
//       { error: "POST not allowed for this route through proxy" },
//       { status: 405 }
//     );
//   }

//   try {
//     const body = await req.text(); // forward the POST body
//     const response = await fetch(targetUrl, {
//       method: "POST",
//       headers: req.headers,
//       body,
//     });

//     const text = await response.text();

//     if (text.trim().startsWith("<")) {
//       return NextResponse.json(
//         { error: "Backend returned HTML instead of JSON", targetUrl },
//         { status: 502 }
//       );
//     }

//     return new Response(text, { status: response.status, headers: response.headers });
//   } catch (err) {
//     console.error("🔴 POST PROXY ERROR:", err);
//     return NextResponse.json({ error: "Proxy crashed" }, { status: 500 });
//   }
// }


import { NextRequest, NextResponse } from "next/server";

// Common function to handle requests safely
async function proxyRequest(
  req: NextRequest,
  method: string,
  pathArray: string[],
  allowMethods: string[] = ["GET", "POST", "PUT", "DELETE"]
) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!API_BASE_URL) {
    return NextResponse.json({ error: "API_BASE_URL is undefined" }, { status: 500 });
  }

  const targetUrl = `${API_BASE_URL}/${pathArray.join("/")}${req.nextUrl.search || ""}`;
  console.log(`🔹 ${method} proxy fetching:`, targetUrl);

  if (!allowMethods.includes(method)) {
    return NextResponse.json(
      { error: `${method} not allowed for this route through proxy` },
      { status: 405 }
    );
  }

  try {
    const options: RequestInit = { method };

    // Forward body for POST/PUT
    if (["POST", "PUT"].includes(method)) {
      options.body = await req.text();
      options.headers = req.headers;
    }

    const response = await fetch(targetUrl, options);
    const text = await response.text();

    // Detect HTML instead of JSON
    if (text.trim().startsWith("<")) {
      return NextResponse.json(
        { error: "Backend returned HTML instead of JSON", targetUrl },
        { status: 502 }
      );
    }

    // Parse JSON safely
    try {
      const json = JSON.parse(text);
      return NextResponse.json(json, { status: response.status });
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON from backend", targetUrl, raw: text },
        { status: 502 }
      );
    }
  } catch (err) {
    console.error(`🔴 ${method} PROXY ERROR:`, err);
    return NextResponse.json({ error: "Proxy crashed" }, { status: 500 });
  }
}

// GET handler
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  return proxyRequest(req, "GET", path);
}

// POST handler
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;

  // Example: allow only login POST through proxy
  const targetPath = path.join("/");
  if (!targetPath.includes("Auth/login")) {
    return NextResponse.json(
      { error: "POST not allowed for this route through proxy" },
      { status: 405 }
    );
  }

  return proxyRequest(req, "POST", path);
}

// PUT handler
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  return proxyRequest(req, "PUT", path);
}

// DELETE handler
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  return proxyRequest(req, "DELETE", path);
}
