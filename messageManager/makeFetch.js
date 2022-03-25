const fetch = require("node-fetch");
const urlApi = "https://api.smash.gg/gql/alpha";
const makeFetch = async(query, variables)=>
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

  module.exports= makeFetch;