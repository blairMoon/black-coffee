// 코드 줄이기
const $ = (selector) => document.querySelector(selector);

//코드 리팩토링하는 과정에서 기능을 쉽게 볼 수 있도록 따로 함수로 빼서 사용 (굳이 중복되는 내용이 아니더라도 )
function App() {
  this.menu = {
    espresso: [],
    frappuccino: [],
    blended: [],
    teavana: [],
    desert: [],
  };
  this.currentCategory = "espresso";
  this.init = () => {
    if (store.getLocalStorage()) {
      this.menu = store.getLocalStorage();
      console.log(this.menu);
      render();
    }
  };
  //데이터를 변경하는 코드는 최소화해서 사용하는 것이 좋음 (객체로 담아서 사용 )

  const store = {
    setLocalStorage: (menu) => {
      localStorage.setItem("menu", JSON.stringify(menu));
    },
    getLocalStorage: () => {
      return JSON.parse(localStorage.getItem("menu")); //여기에 return을 써주지 않으면 init함수에서 length
    },
  };
  const render = () => {
    const templete = this.menu[this.currentCategory]
      .map((item, index) => {
        return `<li data-menu-id="${index}" class="menu-list-item d-flex items-center py-2">
    <span class="w-100 pl-2 menu-name">${item.name}</span>
       <button
      type="button"
      class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button"
    >
      품절
    </button>
    <button
      type="button"
      class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button"
    >
      수정
    </button>
    <button
      type="button"
      class="bg-gray-50 text-gray-500 text-sm menu-remove-button"
    >
      삭제
    </button>
  </li>`;
      })
      .join(""); //map이 새로운 배열을 생성해서 이 templete을 그대로 보여주면 배열 그자체 (콤마포함)갸 보여지게 됨. 그래서 join을 사용하여 ,를 없애줌

    $("#menu-list").innerHTML = templete;
    updateMenuCount();
  };

  const addMenuName = (e) => {
    if ($("#menu-name").value === "") {
      alert("값을 입력해주세요 ");
      return;
    }
    const menuName = $("#menu-name").value;
    this.menu[this.currentCategory].push({ name: menuName });
    store.setLocalStorage(this.menu);
    render();
    $("#menu-name").value = ""; //form 전송될 때 input 초기화
  };
  const updateMenuCount = () => {
    const menuCount = $("#menu-list").querySelectorAll("li").length;
    $(".menu-count").innerText = `총 ${menuCount}개`;
  };
  const updateMenuName = (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    const updatedMenuName = prompt("메뉴명을 수정하세요", $menuName.innerText);
    this.menu[this.currentCategory][menuId].name = updatedMenuName;
    $menuName.innerText = updatedMenuName;

    store.setLocalStorage(this.menu);
  }; // 수정버튼을 눌렀을 때만 작동하기 위하여 className으로 수정버튼을 구분하고 수정버튼 눌렀을 떄만 작동하는 코드 작성 (이벤트위임)

  const removeMenuName = (e) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      const menuId = e.target.closest("li").dataset.menuId;
      this.menu[this.currentCategory].splice(menuId, 1);
      e.target.closest("li").remove();
      updateMenuCount();
      store.setLocalStorage(this.menu);
    }
  };

  // 상태는 변하는 데이터 , 이 앱에서 변하는 것이 무엇인가 = 메뉴명
  // form 태그가 자동으로 전송되는 것을 막아주는 코드
  $("#menu-form").addEventListener("submit", (e) => {
    e.preventDefault();
  });
  $("#menu-list").addEventListener("click", (e) => {
    if (e.target.classList.contains("menu-edit-button")) {
      updateMenuName(e);
    }

    // 삭제버튼
    if (e.target.classList.contains("menu-remove-button")) {
      removeMenuName(e);
    }
  });

  $(".input-submit").addEventListener("click", addMenuName); //화살표함수 안쓰고 addMenuName으로 축약가능

  $("#menu-name").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      addMenuName();
    }
  });
  $("nav").addEventListener("click", (e) => {
    const isCategoryBtn = e.target.classList.contains("cafe-category-name");
    if (isCategoryBtn) {
      const categoryName = e.target.dataset.categoryName;
      this.currentCategory = categoryName;
      console.log(categoryName);
      $("#category-title").innerText = `${e.target.innerText} 메뉴 관리`;
      render();
    }
  });
}

const app = new App();
app.init();
