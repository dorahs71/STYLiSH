const ajax = async (url, callback) => {
  try {
    await fetch(url)
      .then((res) => {
        const data = res.json();
        return data;
      })
      .then((data) => {
        callback(data);
      });
  } catch (error) {
    console.error("Error:", error);
  }
};

const search = () => {
  const href = window.location.href.split("?")[0];
  const [hrefProduct] = href.split("product.html");
  const [hrefCart] = href.split("cart.html");
  const [hrefProfile] = href.split("profile.html");
  const [hrefThank] = href.split("thankyou.html");
  const desktopSearch = document.querySelector(".desktop-search");
  desktopSearch.addEventListener("keydown", (event) => {
    if (event.code === "Enter") {
      const keyword = desktopSearch.value;
      if (href.includes("product")) {
        window.location.href = `${hrefProduct}?tag=${keyword}`;
      } else if (href.includes("cart")) {
        window.location.href = `${hrefCart}?tag=${keyword}`;
      } else if (href.includes("profile")) {
        window.location.href = `${hrefProfile}?tag=${keyword}`;
      } else {
        window.location.href = `${hrefThank}?tag=${keyword}`;
      }
    }
  });

  const mobileSearch = document.querySelector(".mobile-search");
  mobileSearch.addEventListener("keydown", (event) => {
    if (event.code === "Enter") {
      const keyword = mobileSearch.value;
      if (href.includes("product")) {
        window.location.href = `${hrefProduct}?tag=${keyword}`;
      } else if (href.includes("cart")) {
        window.location.href = `${hrefCart}?tag=${keyword}`;
      } else if (href.includes("profile")) {
        window.location.href = `${hrefProfile}?tag=${keyword}`;
      } else {
        window.location.href = `${hrefThank}?tag=${keyword}`;
      }
    }
  });
};

const cartNum = () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartCounts = document.querySelectorAll(".count");
  cartCounts.forEach((count) => {
    const newCount = cart.length;
    const countNum = count;
    countNum.innerHTML = newCount;
  });
};

window.fbAsyncInit = function check() {
  FB.init({
    appId: "588944722115820",
    cookie: true,
    xfbml: true,
    version: "v11.0"
  });
};

(function log(d, s, id) {
  const fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {
    return;
  }
  const js = d.createElement(s);
  js.id = id;
  js.src = "https://connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
})(document, "script", "facebook-jssdk");

function postApi(res) {
  const provider = res.authResponse.graphDomain;
  const { accessToken } = res.authResponse;
  const url = "https://api.appworks-school.tw/api/1.0/user/signin";

  const headers = { "Content-Type": "application/json" };
  const body = {
    provider: `${provider}`,
    access_token: `${accessToken}`
  };

  fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body)
  })
    .then((response) => response.json())
    .catch((error) => console.error("Error:", error))
    .then((list) => {
      localStorage.setItem("signData", JSON.stringify(list));
    });
}

const message = {
  success: "恭喜您成功登入囉！",
  fail: "登入失敗，若有疑問請洽客服",
  fbLogin: "將為您導到FB登入會員頁面"
};

const showAlert = (type, string) => {
  Swal.fire({
    position: "center",
    icon: type,
    title: string
  });
};

const alertEvent = (type, string, callback) => {
  Swal.fire({
    position: "center",
    icon: type,
    title: string
  }).then((result) => {
    if (result.isConfirmed) {
      callback();
    }
  });
};

function login() {
  FB.login(
    (res) => {
      if (res.status === "connected") {
        showAlert("success", message.success);
        postApi(res);
      } else {
        showAlert("error", message.fail);
      }
    },
    {
      scope: "public_profile,email",
      auth_type: "rerequest"
    }
  );
}

const backIndex = () => {
  window.location = "./";
};

function logout() {
  FB.getLoginStatus((res) => {
    if (res.status === "connected") {
      FB.logout(() => {
        alertEvent("success", "登出成功", backIndex);
        localStorage.removeItem("signData");
      });
    }
  });
}

function checkLoginState() {
  FB.getLoginStatus((res) => {
    if (res.status === "connected") {
      window.location = "./profile.html";
    } else {
      alertEvent("info", message.fbLogin, login);
    }
  });
}

const memberClick = () => {
  const members = document.getElementsByClassName("member");
  for (let i = 0; i < members.length; i += 1) {
    members[i].addEventListener("click", checkLoginState);
  }
};

function renderHeader() {
  const desktopHeaderHtml = ` <a href="./" class="logo">
        <img src="./images/logo.png" height="48" alt="logo" />
      </a>
      <div class="nav">
        <a href="./?tag=women" class="tag women">女裝</a>
        <div class="tag-line">|</div>
        <a href="./?tag=men" class="tag men">男裝</a>
        <div class="tag-line">|</div>
        <a href="./?tag=accessories" class="tag accessories">配件</a>
      </div>
      <input type="text" class="desktop-search" />
      <a class="cart" href="./cart.html">
        <img src="./images/cart.png" height="44" alt="cart" />
        <div class="count">0</div>
      </a>
      <div class="member">
        <img src="./images/member.png" height="44" alt="member" />
      </div>`;
  document.querySelector(".desktop-header").innerHTML = desktopHeaderHtml;

  const mobileHeaderHtml = ` <a href="./" class="logo">
        <img src="./images/logo.png" height="20" alt="logo" />
      </a>
      <input type="text" class="mobile-search" />
    </div>
    <div class="mobile-nav">
      <a href="./?tag=women" class="tag women">女裝</a>
      <a href="./?tag=men" class="tag men">男裝</a>
      <a href="./?tag=accessories" class="tag accessories">配件</a>`;
  document.querySelector(".mobile-header").innerHTML = mobileHeaderHtml;
}

function renderFooter() {
  const footerHtml = `<nav>
        <ul>
          <li>關於 Stylish</li>
          <li>服務條款</li>
          <li>隱私政策</li>
          <li>聯絡我們</li>
          <li>FAQ</li>
        </ul>
      </nav>
      <div class="links">
        <img src="./images/line.png" alt="line" />
        <img src="./images/twitter.png" alt="twitter" />
        <img src="./images/facebook.png" alt="fb" />
      </div>
      <div class="rights">© 2021. All rights reserved.</div>`;
  document.querySelector("footer").innerHTML = footerHtml;

  const mobileFooterHtml = `<a class="cart" href="./cart.html">
          <img src="./images/cart-mobile.png" height="44" alt="cart" />
          <div class="count">0</div>
          購物車
        </a>
        <div class="member">
          <img src="./images/member-mobile.png" height="44" alt="member" />
          會員
        </div>`;
  document.querySelector(".mobile-footer").innerHTML = mobileFooterHtml;
  memberClick();
}

export {
  ajax,
  cartNum,
  search,
  renderHeader,
  renderFooter,
  showAlert,
  alertEvent,
  logout,
  backIndex
};
