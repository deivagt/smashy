import fetch from "node-fetch";
const urlApi = "https://api.smash.gg/gql/alpha";
const makeFetch = (query:string, variables:any)=>
fetch(urlApi, 
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${process.env.smashggToken}`,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  }
  
  )
  .then((r) => r.json())
  .then((data) =>{ return data});

  export {makeFetch};