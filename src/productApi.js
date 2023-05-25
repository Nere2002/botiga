const axios = require('axios');

function getProductData() {
  return axios.get('https://amazon-product-reviews-keywords.p.rapidapi.com/product/search\'')
    .then(response => response.data.products)
    .catch(error => {
      console.error('Error al obtener los productos:', error);
      return [];
    });
}

module.exports = {
  getProductData
};
