import Mustache from "mustache";

const template = `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <title>{{title}}</title>
  <meta name="twitter:card" content="player">
  <meta name="twitter:title" content="{{title}}">
  <meta name="twitter:image" content="https://i.ytimg.com/vi/{{videoId}}/maxresdefault.jpg">
  <meta name="twitter:player" content="https://www.youtube.com/embed/{{videoId}}?start={{start}}&end={{end}}">
  <meta name="twitter:player:width" content="560">
  <meta name="twitter:player:height" content="315">
  <meta http-equiv="refresh" content="0; URL=https://www.youtube.com/watch?v={{videoId}}&start={{start}}">
</head>

<body>
  jump to youtube...
</body>

</html>
`;

export async function handler(event) {
  if (event.httpMethod != "GET") {
    return {
      statusCode: 405,
      body: "Method Not Allowed"
    };
  }
  const q = event.queryStringParameters;
  for (const key of ['t', 'd', 'v', 'r']) {
    if (!(key in q)) {
    return {
      statusCode: 400,
      body: `Invalid Parameters: ${JSON.stringify(q, null, 4)}`
    };
    }
  }
  const pat = /^(\d+)-(\d+)$/;
  const mat = pat.exec(q.r);
  if (mat == null) {
    return {
      statusCode: 400,
      body: `Invalid Parameters: ${JSON.stringify(q, null, 4)}`
    };
  }
  const {
    v: videoId,
    r: range,
    t: title,
  } = q;
  const [, start, end] = mat;
  const data = { videoId, range, title, start, end };
  return {
    statusCode: 200,
    body: Mustache.render(template, data)
  };
}