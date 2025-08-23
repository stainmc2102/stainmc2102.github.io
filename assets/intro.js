document.addEventListener("DOMContentLoaded", function () {
  // Kiểm tra nếu đã chạy intro trong session chưa
  if (!sessionStorage.getItem("introPlayed")) {
    const intro = document.querySelector(".intro");
    const content = document.querySelector(".content");

    content.style.display = "none"; // Ẩn nội dung trước

    setTimeout(() => {
      intro.style.opacity = "0";
      setTimeout(() => {
        intro.style.display = "none";
        content.style.display = "block";
        sessionStorage.setItem("introPlayed", "true"); // Lưu trạng thái intro đã chạy
      }, 800);
    }, 2500); // thời gian intro
  } else {
    // Nếu đã chạy intro rồi thì bỏ qua
    const intro = document.querySelector(".intro");
    if (intro) intro.style.display = "none";
  }
});
