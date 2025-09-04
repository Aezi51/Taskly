
document.addEventListener("DOMContentLoaded", function() {
    const loadComponent = (id, url) => {
        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error(`Failed to load component: ${response.statusText}`);
                return response.text();
            })
            .then(data => {
                const element = document.getElementById(id);
                if (element) {
                    element.innerHTML = data;
                    if (typeof lucide !== 'undefined') {
                        lucide.createIcons();
                    }
                }
            })
            .catch(error => console.error(`Error loading component from ${url}:`, error));
    };
    // Adjust path based on whether the page is a tool or a main page
    const pathPrefix = window.location.pathname.includes('/tools/') ? '../../' : './';
    loadComponent("header-placeholder", `${pathPrefix}components/header.html`);
    loadComponent("footer-placeholder", `${pathPrefix}components/footer.html`);
});
