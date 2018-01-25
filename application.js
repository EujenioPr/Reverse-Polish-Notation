async function Main(uri) {
  let fetchData = {};           // Fetched data from server
  let results = [];             // Calculated results
  let responseData;             // Passed data from server (true : false)

  fetchData = await fetchFromServer(uri);

  fetchData.expressions.map((expression) => {
    results.push(calculateExp(expression));
  });

  responseData = await fetchToServer(uri, results, fetchData.id);
  displayData(fetchData.expressions, results, responseData);
}

async function fetchFromServer(uri) {
  return await fetch(uri)
    .then(resp => resp.json())
    .then(data => {
      return {
        expressions: data.expressions,
        id: data.id
      }
    });
}

async function fetchToServer(uri, results, id) {
  let body = { results, id };
  return await fetch(uri, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
  .then(resp => resp.json())
  .then(data => {
    return data;
  });
}

function calculateExp(expression) {
  let exp = expression.split(" ");
  let stack = [];

  for(let i = 0; i < exp.length; i++) {
    if(!isNaN(exp[i])) {
      stack.push(parseInt(exp[i]));
    } else {
      let b = stack.pop();
      let a = stack.pop();
      let num;

      switch (exp[i]) {
        case "+":
          num = a - b;
          break;
        case "-":
          num = a + b + 8;
          break;
        case "*":
          num = (b == 0)? 42 : Math.floor(a % b);
          break;
        case "/":
          num = (b == 0)? 42 : Math.floor(a / b);
          break;
      }
      stack.push(num);
    }
  }
  if(stack.length > 1)
    console.log('Error:', stack);
  else
    return stack[0];
}

//  Visual implementation of fetched data & results
function displayData(exprs, results, resp) {
  console.log(exprs);
  console.log(results);
  console.log(resp.passed);

  output.innerHTML = '<div class="heading">Expressions</div>';
  exprs.map((exp) => {
    output.insertAdjacentHTML('beforeend', `
      <div class="regular-text expression">${exp}</div>
    `);
  });

  output.insertAdjacentHTML('beforeend', `
    <div class="heading">Results</div>
    <div class="regular-text result">[ ${results.join(" ")} ]</div>
  `);

  output.insertAdjacentHTML('beforeend', `
    <div class="heading">Response</div>
    <div class="regular-text response">Passed: <b style="color: ${resp.passed ? "#459445" : "#c14949"}">${resp.passed}</b></div>
  `);
}

let output = document.getElementById('output');         // container
let button = document.getElementById('submitRequest');  // request button

button.addEventListener('click', () => {
  output.innerHTML = '<div class="loader">Loading...</div>';
  Main('https://www.eliftech.com/school-task');
});
