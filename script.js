< script >
    // Chuyển tab chính (Portfolio, Donate, Affiliate)
    function showMainTab(event, tabId) {
        event.preventDefault();

        // Ẩn tất cả main tabs
        document.querySelectorAll('.main-tab').forEach(tab => {
            tab.classList.remove('active');
        });

        // Gỡ active khỏi tất cả menu items
        document.querySelectorAll('nav.menu a').forEach(link => {
            link.classList.remove('active');
        });

        // Hiện tab được chọn và gán active
        document.getElementById(tabId).classList.add('active');
        event.currentTarget.classList.add('active');
    }

// Chuyển tab con trong Portfolio
function showSubTab(event, tabId) {
    event.preventDefault();

    // Ẩn tất cả tab con
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Gỡ active khỏi tất cả nút tab
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Hiện tab con được chọn và gán active
    document.getElementById(tabId).classList