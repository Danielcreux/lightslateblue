document.addEventListener("DOMContentLoaded", function () {
      class DanielcreuxEditor {
        constructor(textarea) {
          this.textarea = textarea;
          this.initEditor();
        }
      
        initEditor() {
          // Create the main container.
          const container = document.createElement("div");
          container.classList.add("danielcreux-container");
      
          // Hide the original textarea and insert the container before it.
          this.textarea.style.display = "none";
          this.textarea.parentNode.insertBefore(container, this.textarea);
          container.appendChild(this.textarea);
      
          // Create the visual editor (a contenteditable div).
          this.editorDiv = document.createElement("div");
          this.editorDiv.classList.add("danieclreux-editor");
          this.editorDiv.setAttribute("contenteditable", "true");
          // Load any preexisting content.
          this.editorDiv.innerHTML = this.textarea.value;
          container.appendChild(this.editorDiv);
      
          // Sync changes from the visual editor.
          this.editorDiv.addEventListener("input", () => {
            this.updateTextarea();
          });
      
          // Create the categorized block selector.
          this.createBlockSelector(container);
      
          // Create the HTML view toggle.
          this.createHTMLToggle(container);
      
          // Initialize WYSIWYG toolbar.
          this.createWYSIWYGToolbar(container);
        }
      
        // Updates the hidden textarea (and the HTML view, if visible)
        // by cloning the editor, removing any style panels, then serializing.
        updateTextarea() {
          const clone = this.editorDiv.cloneNode(true);
          clone.querySelectorAll('.image-style-panel').forEach(panel => panel.remove());
          let html = "";
          Array.from(clone.children).forEach(child => {
            html += child.outerHTML + "\n";
          });
          this.textarea.value = html;
          if (this.htmlEditor && this.htmlEditor.style.display !== "none") {
            this.htmlEditor.value = html;
          }
        }
      
        createBlockSelector(container) {
          const blockSelector = document.createElement("select");
          blockSelector.classList.add("danielcreux-block-selector");
      
          // Define categories and their blocks.
          const categories = [
            {
              name: "Bloques de Contenido Básicos",
              blocks: [
                { name: "Párrafo", tag: "p" },
                { name: "Encabezado (H1)", tag: "h1" },
                { name: "Encabezado (H2)", tag: "h2" },
                { name: "Encabezado (H3)", tag: "h3" },
                { name: "Lista no ordenada", tag: "ul" },
                { name: "Lista ordenada", tag: "ol" },
                { name: "Cita", tag: "blockquote" },
                { name: "Código", tag: "pre" }
              ]
            },
            {
              name: "Bloques de Medios",
              blocks: [
                { name: "Imagen", tag: "img" },
                { name: "Galería", tag: "gallery" },
                { name: "Audio", tag: "audio" },
                { name: "Vídeo", tag: "video" },
                { name: "Archivo", tag: "file" }
              ]
            },
            {
              name: "Bloques de Inserción y Embeds",
              blocks: [
                { name: "Botón", tag: "button" },
                { name: "Tabla", tag: "table" },
                { name: "Separador", tag: "hr" },
                { name: "Shortcode", tag: "shortcode" },
                { name: "HTML Personalizado", tag: "html" },
                { name: "Widget", tag: "widget" }
              ]
            },
            {
              name: "Bloques de Inserción de Terceros",
              blocks: [
                { name: "YouTube", tag: "youtube" },
                { name: "Vimeo", tag: "vimeo" },
                { name: "Twitter", tag: "twitter" },
                { name: "Facebook", tag: "facebook" },
                { name: "Instagram", tag: "instagram" },
                { name: "Google Maps", tag: "maps" },
                { name: "GitHub Gist", tag: "gist" }
              ]
            },
            {
              name: "Bloques de Diseño",
              blocks: [
                { name: "Grupo", tag: "group" },
                { name: "Columna", tag: "column" },
                { name: "Fila", tag: "row" },
                { name: "Caja de Contenedor", tag: "container" },
                { name: "Rejilla", tag: "grid" }
              ]
            },
            {
              name: "Bloques de Tema y Plantillas",
              blocks: [
                { name: "Encabezado del sitio", tag: "site-header" },
                { name: "Imagen Destacada", tag: "featured-image" },
                { name: "Fecha de Publicación", tag: "publication-date" },
                { name: "Autor", tag: "author" },
                { name: "Navegación", tag: "navigation" }
              ]
            }
          ];
      
          // Create optgroups for each category.
          categories.forEach(category => {
            const optgroup = document.createElement("optgroup");
            optgroup.label = category.name;
            category.blocks.forEach(block => {
              const option = document.createElement("option");
              option.value = block.tag;
              option.textContent = block.name;
              optgroup.appendChild(option);
            });
            blockSelector.appendChild(optgroup);
          });
      
          // Create the "Add Block" button.
          const addButton = document.createElement("button");
          addButton.setAttribute("type", "button");
          addButton.textContent = "Añadir bloque";
          addButton.classList.add("danielcreux-add-block");
      
          container.appendChild(blockSelector);
          container.appendChild(addButton);
      
          addButton.addEventListener("click", () => {
            this.insertBlock(blockSelector.value);
          });
        }
      
        createHTMLToggle(container) {
          // Container for the toggle switch.
          const toggleContainer = document.createElement("div");
          toggleContainer.classList.add("danielcreux-html-toggle-container");
      
          // The checkbox for toggling the HTML view.
          const toggleSwitch = document.createElement("input");
          toggleSwitch.type = "checkbox";
          toggleSwitch.id = "html-toggle-" + Math.random().toString(36).substr(2, 5);
          toggleSwitch.classList.add("danielcreux-html-toggle");
      
          // Label styled as a slider.
          const toggleLabel = document.createElement("label");
          toggleLabel.setAttribute("for", toggleSwitch.id);
          toggleLabel.classList.add("danielcreux-html-toggle-label");
          toggleLabel.textContent = "";
      
          toggleContainer.appendChild(toggleSwitch);
          toggleContainer.appendChild(toggleLabel);
      
          container.appendChild(toggleContainer);
      
          // Create the HTML editor textarea (initially hidden).
          this.htmlEditor = document.createElement("textarea");
          this.htmlEditor.classList.add("danielcreux-html-editor");
          this.htmlEditor.style.display = "none";
          container.appendChild(this.htmlEditor);
      
          // Toggle the views.
          toggleSwitch.addEventListener("change", () => {
            if (toggleSwitch.checked) {
              this.htmlEditor.value = this.textarea.value;
              this.editorDiv.style.display = "none";
              this.htmlEditor.style.display = "block";
            } else {
              this.editorDiv.innerHTML = this.htmlEditor.value;
              this.editorDiv.style.display = "block";
              this.htmlEditor.style.display = "none";
              this.updateTextarea();
            }
          });
      
          this.htmlEditor.addEventListener("input", () => {
            this.updateTextarea();
          });
        }
      
        insertBlock(tag) {
          let newBlock;
      
          switch (tag) {
            // Basic Content Blocks.
            case "p":
            case "h1":
            case "h2":
            case "h3":
            case "ul":
            case "ol":
              newBlock = document.createElement(tag);
              newBlock.textContent = `Nuevo ${tag.toUpperCase()}`;
              break;
            case "blockquote":
              newBlock = document.createElement("blockquote");
              newBlock.textContent = "Cita de ejemplo";
              break;
            case "pre":
              newBlock = document.createElement("pre");
              newBlock.textContent = "Código de ejemplo";
              break;
      
            // Media Blocks.
            case "img":
              // Create a hidden file input element for selecting an image.
              const fileInput = document.createElement("input");
              fileInput.type = "file";
              fileInput.accept = "image/*";
              fileInput.style.display = "none";
              document.body.appendChild(fileInput);
      
              fileInput.addEventListener("change", (event) => {
                const file = event.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    const newImage = document.createElement("img");
                    newImage.src = e.target.result;
                    newImage.alt = "Imagen seleccionada";
                    newImage.setAttribute("data-block-type", tag);
                    newImage.classList.add("block-" + tag, "danielcreux-block");
                    this.editorDiv.appendChild(newImage);
                    this.updateTextarea();
      
                    newImage.addEventListener("mouseenter", () => {
                      const deleteBtn = document.createElement("button");
                      deleteBtn.textContent = "×";
                      deleteBtn.classList.add("block-delete-btn");
                      deleteBtn.setAttribute("title", "Eliminar bloque");
                      deleteBtn.addEventListener("click", (e) => {
                        e.stopPropagation();
                        newImage.remove();
                        this.updateTextarea();
                      });
                      newImage.appendChild(deleteBtn);
                    });
                    newImage.addEventListener("mouseleave", () => {
                      const deleteBtn = newImage.querySelector(".block-delete-btn");
                      if (deleteBtn) {
                        deleteBtn.remove();
                      }
                    });
      
                    this.makeImageResizable(newImage);
      
                    // Open the style panel when the image is clicked.
                    newImage.addEventListener("click", (e) => {
                      e.stopPropagation();
                      this.attachImageStylePanel(newImage);
                    });
                  };
                  reader.readAsDataURL(file);
                }
                fileInput.remove();
              });
      
              fileInput.click();
              return;
      
            case "gallery":
              newBlock = document.createElement("div");
              newBlock.classList.add("gallery");
              for (let i = 0; i < 3; i++) {
                const img = document.createElement("img");
                img.src = "https://via.placeholder.com/150";
                img.alt = "Imagen de galería";
                img.classList.add("gallery-image");
                newBlock.appendChild(img);
              }
              break;
            case "audio":
              newBlock = document.createElement("audio");
              newBlock.controls = true;
              const audioSource = document.createElement("source");
              audioSource.src = "https://www.w3schools.com/html/horse.mp3";
              newBlock.appendChild(audioSource);
              break;
            case "video":
              newBlock = document.createElement("video");
              newBlock.controls = true;
              const videoSource = document.createElement("source");
              videoSource.src = "https://www.w3schools.com/html/mov_bbb.mp4";
              newBlock.appendChild(videoSource);
              break;
            case "file":
              newBlock = document.createElement("a");
              newBlock.href = "#";
              newBlock.textContent = "Descargar archivo de ejemplo";
              break;
      
            // Interactive/Embed Blocks.
            case "button":
              newBlock = document.createElement("button");
              newBlock.textContent = "Botón de ejemplo";
              break;
            case "table":
              newBlock = document.createElement("table");
              newBlock.border = "1";
              const tbody = document.createElement("tbody");
              const row = document.createElement("tr");
              const cell1 = document.createElement("td");
              cell1.textContent = "Celda 1";
              const cell2 = document.createElement("td");
              cell2.textContent = "Celda 2";
              row.appendChild(cell1);
              row.appendChild(cell2);
              tbody.appendChild(row);
              newBlock.appendChild(tbody);
              break;
            case "hr":
              newBlock = document.createElement("hr");
              break;
            case "shortcode":
              newBlock = document.createElement("div");
              newBlock.classList.add("shortcode");
              newBlock.textContent = "[shortcode]";
              break;
            case "html":
              newBlock = document.createElement("div");
              newBlock.classList.add("custom-html");
              newBlock.textContent = "<p>HTML personalizado</p>";
              break;
            case "widget":
              newBlock = document.createElement("div");
              newBlock.classList.add("widget");
              newBlock.textContent = "Widget: contenido dinámico";
              break;
      
            // Third-Party Embeds.
            case "youtube":
              let videoUrl = prompt("Ingrese la URL de YouTube o el ID del video:", "dQw4w9WgXcQ");
              if (!videoUrl) { videoUrl = "dQw4w9WgXcQ"; }
              if (!videoUrl.includes("http")) {
                videoUrl = "https://www.youtube.com/embed/" + videoUrl;
              }
              newBlock = document.createElement("iframe");
              newBlock.src = videoUrl;
              newBlock.width = 560;
              newBlock.height = 315;
              newBlock.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
              newBlock.allowFullscreen = true;
              break;
            case "vimeo":
              newBlock = document.createElement("iframe");
              newBlock.src = "https://player.vimeo.com/video/76979871";
              newBlock.width = 640;
              newBlock.height = 360;
              newBlock.allow = "autoplay; fullscreen; picture-in-picture";
              newBlock.allowFullscreen = true;
              break;
            case "twitter":
              newBlock = document.createElement("blockquote");
              newBlock.classList.add("twitter-tweet");
              newBlock.textContent = "Tweet embed placeholder";
              break;
            case "facebook":
              newBlock = document.createElement("div");
              newBlock.classList.add("fb-post");
              newBlock.textContent = "Facebook embed placeholder";
              break;
            case "instagram":
              newBlock = document.createElement("div");
              newBlock.classList.add("instagram-media");
              newBlock.textContent = "Instagram embed placeholder";
              break;
            case "maps":
              newBlock = document.createElement("iframe");
              newBlock.src = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3...";
              newBlock.width = 600;
              newBlock.height = 450;
              newBlock.style.border = 0;
              newBlock.allowFullscreen = "";
              newBlock.loading = "lazy";
              break;
            case "gist":
              newBlock = document.createElement("script");
              newBlock.src = "https://gist.github.com/username/gistid.js";
              break;
      
            // Design Blocks.
            case "group":
              newBlock = document.createElement("div");
              newBlock.classList.add("group");
              newBlock.textContent = "Grupo de bloques";
              break;
            case "column":
              newBlock = document.createElement("div");
              newBlock.classList.add("column");
              newBlock.textContent = "Columna";
              break;
            case "row":
              newBlock = document.createElement("div");
              newBlock.classList.add("row");
              newBlock.textContent = "Fila";
              break;
            case "container":
              newBlock = document.createElement("div");
              newBlock.classList.add("container-box");
              newBlock.textContent = "Caja de contenedor";
              break;
            case "grid":
              newBlock = document.createElement("div");
              newBlock.classList.add("grid");
              newBlock.textContent = "Rejilla";
              break;
      
            // Theme/Template Blocks.
            case "site-header":
              newBlock = document.createElement("header");
              newBlock.textContent = "Encabezado del sitio";
              break;
            case "featured-image":
              newBlock = document.createElement("img");
              newBlock.src = "https://via.placeholder.com/600x200";
              newBlock.alt = "Imagen destacada";
              break;
            case "publication-date":
              newBlock = document.createElement("time");
              newBlock.textContent = "Fecha de publicación";
              break;
            case "author":
              newBlock = document.createElement("span");
              newBlock.textContent = "Autor";
              break;
            case "navigation":
              newBlock = document.createElement("nav");
              newBlock.textContent = "Navegación";
              break;
            default:
              newBlock = document.createElement("div");
              newBlock.textContent = `Bloque desconocido: ${tag}`;
          }
      
          if (newBlock) {
            newBlock.setAttribute("data-block-type", tag);
            newBlock.classList.add("block-" + tag);
            newBlock.classList.add("danielcreux-block");
      
            this.editorDiv.appendChild(newBlock);
            this.updateTextarea();
      
            newBlock.addEventListener("mouseenter", () => {
              const deleteBtn = document.createElement("button");
              deleteBtn.textContent = "×";
              deleteBtn.classList.add("block-delete-btn");
              deleteBtn.setAttribute("title", "Eliminar bloque");
              deleteBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                newBlock.remove();
                this.updateTextarea();
              });
              newBlock.appendChild(deleteBtn);
            });
      
            newBlock.addEventListener("mouseleave", () => {
              const deleteBtn = newBlock.querySelector(".block-delete-btn");
              if (deleteBtn) { deleteBtn.remove(); }
            });
          }
        }
      
        makeImageResizable(img) {
          const container = document.createElement("div");
          container.classList.add("resizable-image-container");
          container.setAttribute("contenteditable", "false");
          img.parentNode.insertBefore(container, img);
          container.appendChild(img);
      
          const handle = document.createElement("div");
          handle.classList.add("resizable-image-handle");
          container.appendChild(handle);
      
          let isResizing = false;
          let startX, startY, startWidth, startHeight;
          const aspectRatio = img.naturalHeight / img.naturalWidth;
      
          const stopDrag = () => {
            isResizing = false;
            document.removeEventListener("mousemove", doDrag);
            document.removeEventListener("mouseup", stopDrag);
            this.updateTextarea();
          };
      
          const doDrag = (evt) => {
            if (!isResizing) return;
            const dx = evt.clientX - startX;
            const newWidth = startWidth + dx;
            const newHeight = newWidth * aspectRatio;
            if (newWidth > 20 && newHeight > 20) {
              img.style.width = newWidth + 'px';
              img.style.height = newHeight + 'px';
            }
          };
      
          handle.addEventListener("mousedown", (evt) => {
            evt.preventDefault();
            isResizing = true;
            startX = evt.clientX;
            startY = evt.clientY;
            startWidth = parseInt(window.getComputedStyle(img).width, 10);
            startHeight = parseInt(window.getComputedStyle(img).height, 10);
            document.addEventListener("mousemove", doDrag);
            document.addEventListener("mouseup", stopDrag);
          });
        }
      
        createWYSIWYGToolbar(container) {
          const baseUrl = 'https://jocarsa.github.io/jocarsa-snow/svg';
      
          const toolbar = document.createElement('div');
          toolbar.className = 'danielcreux-snow-toolbar';
          toolbar.innerHTML = `
            <button type="button" data-command="bold"><img src="${baseUrl}/bold.svg" alt="Negrita"></button>
            <button type="button" data-command="italic"><img src="${baseUrl}/italic.svg" alt="Itálica"></button>
            <button type="button" data-command="underline"><img src="${baseUrl}/underline.svg" alt="Subrayado"></button>
            <button type="button" data-command="strikeThrough"><img src="${baseUrl}/strike.svg" alt="Tachado"></button>
            <button type="button" data-command="justifyLeft"><img src="${baseUrl}/left.svg" alt="Justificar a la izquierda"></button>
            <button type="button" data-command="justifyCenter"><img src="${baseUrl}/center.svg" alt="Justificar al centro"></button>
            <button type="button" data-command="justifyRight"><img src="${baseUrl}/right.svg" alt="Justificar a la derecha"></button>
            <button type="button" data-command="justifyFull"><img src="${baseUrl}/justify.svg" alt="Justificación completa"></button>
            <button type="button" data-command="insertOrderedList"><img src="${baseUrl}/ul.svg" alt="Lista ordenada"></button>
            <button type="button" data-command="insertUnorderedList"><img src="${baseUrl}/ol.svg" alt="Lista no ordenada"></button>
            <button type="button" id="insertImageButton"><img src="${baseUrl}/image.svg" alt="Imagen"></button>
            <input type="file" id="imageUploader" accept="image/*" style="display: none;">
            <button type="button" data-command="removeFormat">Clear</button>
            <button type="button" data-command="insertTable"><img src="${baseUrl}/table.svg" alt="Insert Table"></button>
            <button type="button" data-command="addRow">Add Row</button>
            <button type="button" data-command="addColumn">Add Column</button>
            <button type="button" data-command="deleteRow">Delete Row</button>
            <button type="button" data-command="deleteColumn">Delete Column</button>
            <label>
              <select id="fontFamilySelector">
                <option value="serif">Serif</option>
                <option value="sans-serif">Sans Serif</option>
                <option value="monospace">Monospace</option>
                <option value="cursive">Cursive</option>
                <option value="fantasy">Fantasy</option>
              </select>
            </label>
            <label>
              <select id="fontSizeSelector">
                <option value="1">Small</option>
                <option value="3">Normal</option>
                <option value="5">Large</option>
                <option value="7">Extra Large</option>
              </select>
            </label>
            <label>
              <select id="blockStyleSelector">
                <option value="p">Paragraph</option>
                <option value="h1">Heading 1</option>
                <option value="h2">Heading 2</option>
                <option value="h3">Heading 3</option>
                <option value="h4">Heading 4</option>
                <option value="h5">Heading 5</option>
                <option value="h6">Heading 6</option>
                <option value="pre">Preformatted</option>
              </select>
            </label>
            <label><input type="color" id="textColorPicker"></label>
            <label><input type="color" id="bgColorPicker"></label>
            <label>
              <select id="floatSelector">
                <option value="none">None</option>
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
            </label>
            <button type="button" id="toggleCodeView">HTML</button>
          `;
      
          container.appendChild(toolbar);
      
          toolbar.querySelectorAll('button[data-command]').forEach(button => {
            button.addEventListener('click', (e) => {
              e.preventDefault();
              const command = button.getAttribute('data-command');
              if (command === 'insertTable') {
                const tableHTML = `
                  <table border="1" style="border-collapse: collapse; width: auto;">
                    <tbody>
                      <tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
                      <tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
                      <tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
                    </tbody>
                  </table>
                `;
                document.execCommand('insertHTML', false, tableHTML);
              }
              else if (command === 'addRow') {
                const sel = window.getSelection();
                if (sel.rangeCount > 0) {
                  let node = sel.anchorNode;
                  while (node && node.nodeName.toLowerCase() !== 'tr') { node = node.parentNode; }
                  if (node && node.nodeName.toLowerCase() === 'tr') {
                    const currentRow = node;
                    const cellCount = currentRow.children.length;
                    const newRow = document.createElement('tr');
                    for (let i = 0; i < cellCount; i++) {
                      const newCell = document.createElement('td');
                      newCell.innerHTML = '&nbsp;';
                      newRow.appendChild(newCell);
                    }
                    currentRow.parentNode.insertBefore(newRow, currentRow.nextSibling);
                  }
                }
              }
              else if (command === 'addColumn') {
                const sel = window.getSelection();
                if (sel.rangeCount > 0) {
                  let node = sel.anchorNode;
                  while (node && node.nodeName.toLowerCase() !== 'td' && node.nodeName.toLowerCase() !== 'th') { node = node.parentNode; }
                  if (node && (node.nodeName.toLowerCase() === 'td' || node.nodeName.toLowerCase() === 'th')) {
                    const currentCell = node;
                    const cellIndex = Array.prototype.indexOf.call(currentCell.parentNode.children, currentCell);
                    let tableNode = currentCell;
                    while (tableNode && tableNode.nodeName.toLowerCase() !== 'table') { tableNode = tableNode.parentNode; }
                    if (tableNode) {
                      const rows = tableNode.querySelectorAll('tr');
                      rows.forEach(row => {
                        const newCell = document.createElement('td');
                        newCell.innerHTML = '&nbsp;';
                        if (row.children.length > cellIndex + 1) {
                          row.insertBefore(newCell, row.children[cellIndex + 1]);
                        } else { row.appendChild(newCell); }
                      });
                    }
                  }
                }
              }
              else if (command === 'deleteRow') {
                const sel = window.getSelection();
                if (sel.rangeCount > 0) {
                  let node = sel.anchorNode;
                  while (node && node.nodeName.toLowerCase() !== 'tr') { node = node.parentNode; }
                  if (node && node.nodeName.toLowerCase() === 'tr') {
                    const currentRow = node;
                    const tbody = currentRow.parentNode;
                    if (tbody.rows.length > 1) { tbody.removeChild(currentRow); }
                    else {
                      let tableNode = tbody.parentNode;
                      tableNode.parentNode.removeChild(tableNode);
                    }
                  }
                }
              }
              else if (command === 'deleteColumn') {
                const sel = window.getSelection();
                if (sel.rangeCount > 0) {
                  let node = sel.anchorNode;
                  while (node && node.nodeName.toLowerCase() !== 'td' && node.nodeName.toLowerCase() !== 'th') { node = node.parentNode; }
                  if (node && (node.nodeName.toLowerCase() === 'td' || node.nodeName.toLowerCase() === 'th')) {
                    const currentCell = node;
                    const cellIndex = Array.prototype.indexOf.call(currentCell.parentNode.children, currentCell);
                    let tableNode = currentCell;
                    while (tableNode && tableNode.nodeName.toLowerCase() !== 'table') { tableNode = tableNode.parentNode; }
                    if (tableNode) {
                      const rows = tableNode.querySelectorAll('tr');
                      rows.forEach(row => {
                        if (row.children.length > cellIndex) { row.removeChild(row.children[cellIndex]); }
                      });
                    }
                  }
                }
              }
              else {
                document.execCommand(command, false, null);
              }
              this.updateTextarea();
            });
          });
      
          toolbar.querySelector('#fontFamilySelector').addEventListener('change', (e) => {
            document.execCommand('fontName', false, e.target.value);
            this.updateTextarea();
          });
          toolbar.querySelector('#fontSizeSelector').addEventListener('change', (e) => {
            document.execCommand('fontSize', false, e.target.value);
            this.updateTextarea();
          });
          toolbar.querySelector('#textColorPicker').addEventListener('input', (e) => {
            document.execCommand('foreColor', false, e.target.value);
            this.updateTextarea();
          });
          toolbar.querySelector('#bgColorPicker').addEventListener('input', (e) => {
            document.execCommand('backColor', false, e.target.value);
            this.updateTextarea();
          });
          toolbar.querySelector('#blockStyleSelector').addEventListener('change', (e) => {
            document.execCommand('formatBlock', false, e.target.value);
            this.updateTextarea();
          });
          toolbar.querySelector('#floatSelector').addEventListener('change', (e) => {
            const selectedOption = e.target.value;
            const selectedImage = this.editorDiv.querySelector('.resizable-image-container img');
            if (selectedImage) {
              selectedImage.style.float = selectedOption;
              this.updateTextarea();
            }
          });
      
          const insertImageButton = toolbar.querySelector('#insertImageButton');
          const imageUploader = toolbar.querySelector('#imageUploader');
          insertImageButton.addEventListener('click', () => { imageUploader.click(); });
          imageUploader.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (event) => {
                const base64String = event.target.result;
                const tempImg = new Image();
                tempImg.src = base64String;
                tempImg.onload = () => {
                  const naturalWidth = tempImg.width;
                  const naturalHeight = tempImg.height;
                  const defaultDisplayWidth = Math.min(naturalWidth, 300);
                  const ratio = naturalHeight / naturalWidth;
                  const defaultDisplayHeight = defaultDisplayWidth * ratio;
                  const resizableHTML = `
                    <div class="resizable-image-container" contenteditable="false">
                      <img src="${base64String}" alt="Inserted Image" style="width: ${defaultDisplayWidth}px; height: ${defaultDisplayHeight}px;">
                      <div class="resizable-image-handle"></div>
                    </div>
                  `;
                  document.execCommand('insertHTML', false, resizableHTML);
      
                  const allContainers = this.editorDiv.querySelectorAll('.resizable-image-container');
                  const thisContainer = allContainers[allContainers.length - 1];
                  const thisImage = thisContainer.querySelector('img');
                  const thisHandle = thisContainer.querySelector('.resizable-image-handle');
      
                  let isResizing = false;
                  let startX, startY, startWidth, startHeight;
                  const aspectRatio = naturalHeight / naturalWidth;
      
                  const stopDrag = () => {
                    isResizing = false;
                    document.removeEventListener("mousemove", doDrag);
                    document.removeEventListener("mouseup", stopDrag);
                    this.updateTextarea();
                  };
      
                  const doDrag = (evt) => {
                    if (!isResizing) return;
                    const dx = evt.clientX - startX;
                    const newWidth = startWidth + dx;
                    const newHeight = newWidth * aspectRatio;
                    if (newWidth > 20 && newHeight > 20) {
                      thisImage.style.width = newWidth + 'px';
                      thisImage.style.height = newHeight + 'px';
                    }
                  };
      
                  thisHandle.addEventListener('mousedown', (evt) => {
                    evt.preventDefault();
                    isResizing = true;
                    startX = evt.clientX;
                    startY = evt.clientY;
                    startWidth = parseInt(window.getComputedStyle(thisImage).width, 10);
                    startHeight = parseInt(window.getComputedStyle(thisImage).height, 10);
                    document.addEventListener("mousemove", doDrag);
                    document.addEventListener("mouseup", stopDrag);
                  });
      
                  thisImage.addEventListener("click", (e) => {
                    e.stopPropagation();
                    this.attachImageStylePanel(thisImage);
                  });
      
                  this.updateTextarea();
                };
              };
              reader.readAsDataURL(file);
            }
          });
      
          this.editorDiv.addEventListener('input', () => { this.updateTextarea(); });
      
          let isCodeView = false;
          const toggleCodeViewBtn = toolbar.querySelector('#toggleCodeView');
          this.codeTextarea = document.createElement("textarea");
          this.codeTextarea.classList.add("danielcreux-snow-code-editor");
          this.codeTextarea.style.display = "none";
          container.appendChild(this.codeTextarea);
      
          toggleCodeViewBtn.addEventListener('click', () => {
            if (!isCodeView) {
              this.codeTextarea.value = this.editorDiv.innerHTML;
              this.editorDiv.style.display = 'none';
              this.codeTextarea.style.display = 'block';
              this.codeTextarea.focus();
              toggleCodeViewBtn.textContent = 'WYSIWYG';
            } else {
              this.editorDiv.innerHTML = this.codeTextarea.value;
              this.codeTextarea.style.display = 'none';
              this.editorDiv.style.display = 'block';
              this.editorDiv.focus();
              toggleCodeViewBtn.textContent = 'HTML';
              this.updateTextarea();
            }
            isCodeView = !isCodeView;
          });
        }
      
        // Attach a style panel to an image for padding, margin, float, and display options.
        attachImageStylePanel(img) {
          let stylePanel = img.parentNode.querySelector('.image-style-panel');
          if (!stylePanel) {
            stylePanel = document.createElement('div');
            stylePanel.className = 'image-style-panel';
            stylePanel.innerHTML = `
              <label style="font-size:12px;">Padding: 
                <input type="number" value="0" min="0" style="width:40px;"> px
              </label>
              <label style="font-size:12px;">Margin: 
                <input type="number" value="0" min="0" style="width:40px;"> px
              </label>
              <label style="font-size:12px;">Float: 
                <select style="font-size:12px;">
                  <option value="none">None</option>
                  <option value="left">Left</option>
                  <option value="right">Right</option>
                  <option value="center">Center</option>
                </select>
              </label>
              <label style="font-size:12px;">Display: 
                <select style="font-size:12px;">
                  <option value="inline">Inline</option>
                  <option value="inline-block">Inline-block</option>
                  <option value="block" selected>Block</option>
                </select>
              </label>
            `;
            stylePanel.style.position = 'absolute';
            stylePanel.style.top = '5px';
            stylePanel.style.right = '5px';
            stylePanel.style.backgroundColor = '#fff';
            stylePanel.style.border = '1px solid #ccc';
            stylePanel.style.padding = '5px';
            stylePanel.style.zIndex = '10';
            if (img.parentNode.style.position === '') { img.parentNode.style.position = 'relative'; }
            img.parentNode.appendChild(stylePanel);
      
            const [paddingInput, marginInput] = stylePanel.querySelectorAll('input');
            const selects = stylePanel.querySelectorAll('select');
            const floatSelect = selects[0];
            const displaySelect = selects[1];
      
            const updateStyles = () => {
              const padding = paddingInput.value + 'px';
              const margin = marginInput.value + 'px';
              const floatValue = floatSelect.value;
              const displayValue = displaySelect.value;
              img.style.padding = padding;
              img.style.margin = margin;
              img.style.display = displayValue;
              if (floatValue === 'center') {
                img.style.float = 'none';
                img.style.display = 'block';
                img.style.marginLeft = 'auto';
                img.style.marginRight = 'auto';
              } else {
                img.style.float = floatValue;
              }
            };
      
            paddingInput.addEventListener('change', updateStyles);
            marginInput.addEventListener('change', updateStyles);
            floatSelect.addEventListener('change', updateStyles);
            displaySelect.addEventListener('change', updateStyles);
      
            // Remove the panel when clicking outside of it or the image.
            const handleClickOutside = (event) => {
              if (!stylePanel.contains(event.target) && event.target !== img) {
                stylePanel.remove();
                document.removeEventListener("click", handleClickOutside);
              }
            };
            setTimeout(() => {
              document.addEventListener("click", handleClickOutside);
            }, 0);
          }
        }
      }
      
      // Initialize the editor on every textarea with the class "danielcreux-lightslateblue".
      document.querySelectorAll("textarea.danielcreux-lightslateblue").forEach(textarea => {
        new DanielcreuxEditor(textarea);
      });
    });
