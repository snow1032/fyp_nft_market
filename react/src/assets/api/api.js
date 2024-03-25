export const getOwnerAddress = (owner) => fetch('http://127.0.0.1:8000/api/nft/getOwnerAddress', {
    method: 'POST',
    body: owner,
    headers: {
      // Authorization: `Bearer ${accessToken}`,
      accept: 'application/json',
    }
  })
  .then((res) => res.json())
  .then((data) => {
    // console.log("test");
    // console.log(creator);
    return data;
  });