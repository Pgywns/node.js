async function json_func() {
  try {
    let promise = await fetch("http://localhost:3000/posts", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: "7", title: "fetch TEST", author: "gywns" }),
    });

    let resolve = await promise.json();
    console.log("결과=>", resolve);

    promise = await fetch("http://localhost:3000/posts");
    resolve = await promise.json();
    console.log("조회=>", resolve);
  } catch (err) {
    console.log(err);
  }
}

json_func();
