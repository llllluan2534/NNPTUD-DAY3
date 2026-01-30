let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
let perPage = 10;
let sortField = null;
let sortOrder = "asc";
let currentEditId = null;

async function getAllProducts() {
  try {
    const response = await fetch("https://api.escuelajs.co/api/v1/products");
    allProducts = await response.json();
    filteredProducts = [...allProducts];
    renderProducts();
    updatePagination();
  } catch (error) {
    console.error("Error fetching products:", error);
    document.getElementById("product-body").innerHTML = `
      <tr>
        <td colspan="8" style="text-align: center; color: #e11d48;">
          Lỗi khi tải sản phẩm. Vui lòng tải lại trang.
        </td>
      </tr>
    `;
  }
}

function renderProducts() {
  const start = (currentPage - 1) * perPage;
  const end = start + perPage;
  const productsToShow = filteredProducts.slice(start, end);

  const container = document.getElementById("product-body");
  const noResults = document.getElementById("noResults");

  if (productsToShow.length === 0) {
    container.innerHTML = "";
    noResults.style.display = "block";
    return;
  }

  noResults.style.display = "none";
  container.innerHTML = "";

  productsToShow.forEach((product, idx) => {
    const row = document.createElement("tr");
    row.style.animationDelay = `${idx * 50}ms`;
    const createdAt = new Date(product.creationAt).toLocaleDateString("vi-VN");
    const updatedAt = new Date(product.updatedAt).toLocaleDateString("vi-VN");
    const imageUrl =
      product.images && product.images[0]
        ? product.images[0]
        : "https://placehold.co/600x400";

    row.innerHTML = `
      <td>${product.id}</td>
      <td>
        <img 
          src="${imageUrl}" 
          alt="${product.title}" 
          class="product-image" 
          onerror="this.src='https://placehold.co/600x400'"
        >
      </td>
      <td>
        <div class="product-title">${product.title}</div>
      </td>
      <td>
        <div class="product-price">$${product.price}</div>
      </td>
      <td>
        <div class="product-description">${product.description || "N/A"}</div>
      </td>
      <td>${createdAt}</td>
      <td>${updatedAt}</td>
      <td>
        <div class="actions-buttons">
          <button class="btn-sort" onclick="editProduct(${product.id})">Sửa</button>
          <button class="btn-danger" onclick="deleteProduct(${product.id})">Xóa</button>
        </div>
      </td>
    `;
    container.appendChild(row);
  });
}

function filterProducts() {
  const searchTerm = document.getElementById("search_txt").value.toLowerCase();
  filteredProducts = allProducts.filter((product) =>
    product.title.toLowerCase().includes(searchTerm),
  );
  currentPage = 1;
  renderProducts();
  updatePagination();
}

function sortBy(field, order) {
  sortField = field;
  sortOrder = order;

  // Update button states
  document.querySelectorAll(".btn-sort").forEach((btn) => {
    btn.classList.remove("active");
  });
  event.target.classList.add("active");

  filteredProducts.sort((a, b) => {
    let aVal = a[field];
    let bVal = b[field];
    if (typeof aVal === "string") {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }
    if (sortOrder === "asc") {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  currentPage = 1;
  renderProducts();
  updatePagination();
}

function changePage(direction) {
  const totalPages = Math.ceil(filteredProducts.length / perPage);
  currentPage += direction;
  if (currentPage < 1) currentPage = 1;
  if (currentPage > totalPages) currentPage = totalPages;
  renderProducts();
  updatePagination();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function changePerPage() {
  perPage = parseInt(document.getElementById("per-page").value);
  currentPage = 1;
  renderProducts();
  updatePagination();
}

function updatePagination() {
  const totalPages = Math.ceil(filteredProducts.length / perPage);
  const pageInfo = document.getElementById("page-info");
  pageInfo.textContent = `${currentPage} of ${totalPages}`;

  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");

  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;
}

function editProduct(id) {
  const product = allProducts.find((p) => p.id === id);
  if (!product) return;

  currentEditId = id;
  document.getElementById("edit-title").value = product.title;
  document.getElementById("edit-price").value = product.price;
  document.getElementById("edit-description").value = product.description || "";
  document.getElementById("edit-images").value =
    product.images && product.images[0] ? product.images[0] : "";

  document.getElementById("editModal").style.display = "block";
}

function closeModal() {
  document.getElementById("editModal").style.display = "none";
  currentEditId = null;
}

function saveEdit() {
  const title = document.getElementById("edit-title").value.trim();
  const price = parseFloat(document.getElementById("edit-price").value);
  const description = document.getElementById("edit-description").value.trim();
  const images = document.getElementById("edit-images").value.trim();

  if (!title || isNaN(price)) {
    alert("Vui lòng nhập đầy đủ thông tin hợp lệ.");
    return;
  }

  const productIndex = allProducts.findIndex((p) => p.id === currentEditId);
  if (productIndex === -1) return;

  allProducts[productIndex].title = title;
  allProducts[productIndex].price = price;
  allProducts[productIndex].description = description;
  allProducts[productIndex].images = images ? [images] : [];
  allProducts[productIndex].updatedAt = new Date().toISOString();

  filteredProducts = [...allProducts];
  if (sortField) {
    sortBy(sortField, sortOrder);
  } else {
    renderProducts();
    updatePagination();
  }

  closeModal();
}

function deleteProduct(id) {
  if (!confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;

  allProducts = allProducts.filter((p) => p.id !== id);
  filteredProducts = [...allProducts];
  if (sortField) {
    sortBy(sortField, sortOrder);
  } else {
    renderProducts();
    updatePagination();
  }
}

// Close modal when clicking outside
window.onclick = function (event) {
  const modal = document.getElementById("editModal");
  if (event.target === modal) {
    closeModal();
  }
};

// Initialize
getAllProducts();
