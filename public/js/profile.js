import {
  cartNum,
  search,
  renderHeader,
  renderFooter,
  alertEvent,
  logout,
  backIndex,
} from "./reset.js";

renderHeader();
renderFooter();
cartNum();
search();

function renderProfile(user) {
  const html = `<h2>會員基本資訊</h2>
        <div class="member_data">
          <div class="member_img">
            <img
              src="${user.picture}"
              alt="member"
            />
          </div>
          <div class="member_detail">
            <h3>${user.name}</h3>
            <h3>${user.email}</h3>
            <button id="logout">登出</button>
          </div>
        </div>`;
  document.getElementById("profile").innerHTML = html;
  const logoutButton = document.getElementById("logout");
  logoutButton.addEventListener("click", logout);
}

const userData = JSON.parse(localStorage.getItem("signData")) || [];
if (userData.length === 0) {
  alertEvent("error", "請先登入會員，才可瀏覽會員頁面呦", backIndex);
} else {
  renderProfile(userData.data.user);
}
