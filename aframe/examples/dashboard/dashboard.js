(function() {
  const tableBody = document.querySelector('#mediaTable tbody');
  const formContainer = document.getElementById('formContainer');
  const form = document.getElementById('mediaForm');
  const formTitle = document.getElementById('formTitle');
  const addButton = document.getElementById('addButton');
  const cancelButton = document.getElementById('cancelButton');
  const idField = document.getElementById('mediaId');
  const nameField = document.getElementById('name');
  const markerField = document.getElementById('marker');
  const fileField = document.getElementById('file');

  const STORAGE_KEY = 'arjsMedia';

  function loadMedia() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  function saveMedia(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  function clearForm() {
    idField.value = '';
    nameField.value = '';
    markerField.value = '';
    fileField.value = '';
  }

  function renderTable() {
    const media = loadMedia();
    tableBody.innerHTML = '';
    media.forEach(item => {
      const tr = document.createElement('tr');
      const previewTd = document.createElement('td');
      if (item.type && item.src) {
        if (item.type.startsWith('image')) {
          const img = document.createElement('img');
          img.src = item.src;
          img.className = 'preview';
          previewTd.appendChild(img);
        } else if (item.type.startsWith('video')) {
          const video = document.createElement('video');
          video.src = item.src;
          video.className = 'preview';
          video.controls = true;
          previewTd.appendChild(video);
        }
      }
      tr.appendChild(previewTd);

      const nameTd = document.createElement('td');
      nameTd.textContent = item.name || '';
      tr.appendChild(nameTd);

      const markerTd = document.createElement('td');
      markerTd.textContent = item.marker || '';
      tr.appendChild(markerTd);

      const actionTd = document.createElement('td');
      const editBtn = document.createElement('button');
      editBtn.textContent = 'Edit';
      editBtn.addEventListener('click', () => showForm(item));
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.addEventListener('click', () => {
        const list = loadMedia().filter(m => m.id !== item.id);
        saveMedia(list);
        renderTable();
      });
      actionTd.appendChild(editBtn);
      actionTd.appendChild(deleteBtn);
      tr.appendChild(actionTd);

      tableBody.appendChild(tr);
    });
  }

  function showForm(item) {
    formContainer.style.display = 'block';
    if (item) {
      formTitle.textContent = 'Edit Media';
      idField.value = item.id;
      nameField.value = item.name || '';
      markerField.value = item.marker || '';
    } else {
      formTitle.textContent = 'Add Media';
      clearForm();
    }
  }

  function hideForm() {
    formContainer.style.display = 'none';
    clearForm();
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const list = loadMedia();
    const id = idField.value || Date.now().toString();
    const name = nameField.value.trim();
    const marker = markerField.value.trim();
    const file = fileField.files[0];
    function finish(src, type) {
      const existing = list.find(m => m.id === id);
      if (existing) {
        existing.name = name;
        existing.marker = marker;
        if (src) {
          existing.src = src;
          existing.type = type;
        }
      } else {
        list.push({ id, name, marker, src, type });
      }
      saveMedia(list);
      renderTable();
      hideForm();
    }
    if (file) {
      const reader = new FileReader();
      reader.onload = function(evt) {
        finish(evt.target.result, file.type);
      };
      reader.readAsDataURL(file);
    } else {
      finish();
    }
  });

  addButton.addEventListener('click', () => showForm());
  cancelButton.addEventListener('click', hideForm);

  renderTable();
})();
