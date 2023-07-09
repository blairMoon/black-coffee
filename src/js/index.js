// 코드 줄이기
const $ = (selector) => document.querySelector(selector);

//코드 리팩토링하는 과정에서 기능을 쉽게 볼 수 있도록 따로 함수로 빼서 사용 (굳이 중복되는 내용이 아니더라도 )
const updateMenuCount = () => {
  const menuCount = $("#espresso-menu-list").querySelectorAll("li").length;
  $(".menu-count").innerText = `총 ${menuCount}개`;
};
const addMenuName = (e) => {
  if ($("#espresso-menu-name").value === "") {
    alert("값을 입력해주세요 ");
    return;
  }
  let espressMenuName = $("#espresso-menu-name").value;
  //
  const menuItemTemlate = (espressMenuName) => {
    return `<li class="menu-list-item d-flex items-center py-2">
  <span class="w-100 pl-2 menu-name">${espressMenuName}</span>
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
  };

  $("#espresso-menu-list").insertAdjacentHTML(
    "beforeend", //beforeBegin으로 했더니 숫자 카운팅이 안됨 .. why?
    menuItemTemlate(espressMenuName)
  );
  updateMenuCount();

  $("#espresso-menu-name").value = ""; //form 전송될 때 input 초기화
};
const updateMenuName = (e) => {
  const $menuName = e.target.closest("li").querySelector(".menu-name");
  const updatedMenuName = prompt("메뉴명을 수정하세요", $menuName.innerText);

  $menuName.innerText = updatedMenuName;
}; // 수정버튼을 눌렀을 때만 작동하기 위하여 className으로 수정버튼을 구분하고 수정버튼 눌렀을 떄만 작동하는 코드 작성 (이벤트위임)

const removeMenuName = (e) => {
  if (confirm("정말 삭제하시겠습니까?")) {
    e.target.closest("li").remove();
    updateMenuCount();
  }
};
function App() {
  // form 태그가 자동으로 전송되는 것을 막아주는 코드
  $("#espresso-menu-form").addEventListener("submit", (e) => {
    e.preventDefault();
  });
  $("#espresso-menu-list").addEventListener("click", (e) => {
    if (e.target.classList.contains("menu-edit-button")) {
      updateMenuName(e);
    }

    // 삭제버튼
    if (e.target.classList.contains("menu-remove-button")) {
      removeMenuName(e);
    }
  });

  $(".input-submit").addEventListener("click", addMenuName); //화살표함수 안쓰고 addMenuName으로 축약가능

  $("#espresso-menu-name").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      addMenuName();
    }
  });
}

App();
