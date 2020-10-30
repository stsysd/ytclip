import Mustache from "mustache";

const template = `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <title>{{title}}</title>
  <meta name="twitter:card" content="player">
  <meta name="twitter:title" content="{{title}}">
  <meta name="twitter:description" content="{{description}}">
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
  for (const key of ['title', 'description', 'videoId', 'range']) {
    if (!(key in q)) {
    return {
      statusCode: 400,
      body: `Invalid Parameters: no-${key}`
    };
    }
  }
  const pat = /^(\d+)-(\d+)$/;
  const mat = pat.exec(q.range);
  if (mat == null) {
    return {
      statusCode: 400,
      body: "Invalid Parameters: range"
    };
  }
  const [, start, end] = mat;
  return {
    statusCode: 200,
    body: Mustache.render(template, { ...q, start, end })
  };
}