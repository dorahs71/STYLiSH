import { cartNum, search, renderHeader, renderFooter } from "./reset.js";

renderHeader();
renderFooter();
cartNum();
search();

const orderNumber = () => {
  const getUrlString = window.location.href;
  const newUrl = new URL(getUrlString);
  const number = newUrl.searchParams.get("number");
  document.getElementById("order").innerHTML = number;
};

orderNumber();
