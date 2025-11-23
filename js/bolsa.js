document.addEventListener("DOMContentLoaded", () => {
    const slots = document.querySelectorAll(".slot");
    let draggedItem = null;

    /* Persistência: Load inicial */
    function loadInventory() {
        const saved = JSON.parse(localStorage.getItem("inventory") || "{}");

        Object.keys(saved).forEach(slotId => {
            const slot = document.querySelector(`.slot[data-slot="${slotId}"]`);
            if (!slot) return;

            slot.innerHTML = ""; // limpamos o slot

            const src = saved[slotId];

            // Só cria o ícone se realmente existir um item
            if (src && src !== "null") {
                const img = document.createElement("img");
                img.src = src;
                img.classList.add("icon");
                img.draggable = true;
                slot.appendChild(img);
            }
        });
    }

    /* Persistência: Save automático */

    function saveInventory() {
        const data = {};

        document.querySelectorAll(".slot").forEach(slot => {
            const id = slot.dataset.slot;
            const icon = slot.querySelector(".icon");
            data[id] = icon ? icon.src : null;
        });

        localStorage.setItem("inventory", JSON.stringify(data));
    }

    loadInventory();

    /* Cursor Behavior */
    document.addEventListener("mousedown", e => {
        if (e.target.classList.contains("icon")) {
            e.target.style.cursor = "grabbing";
        }
    });

    document.addEventListener("mouseup", () => {
        document.querySelectorAll(".icon").forEach(icon => {
            icon.style.cursor = "default";
        });
    });

    /* Drag & Drop */
    document.addEventListener('dragstart', e => {
        if (e.target.classList.contains('icon')) {
            draggedItem = e.target;
            e.target.style.cursor = "grabbing";
            slots.forEach(s => s.classList.remove("active"));
        }
    });

    slots.forEach(slot => {
        slot.addEventListener('dragover', e => {
            e.preventDefault();
            slot.classList.add('drag-over');
        });

        slot.addEventListener('dragleave', () => {
            slot.classList.remove('drag-over');
        });

        slot.addEventListener('drop', () => {
            slot.classList.remove('drag-over');

            if (!draggedItem) return;

            const existingItem = slot.querySelector('.icon');
            const originSlot = draggedItem.parentElement;

            if (existingItem) {
                originSlot.appendChild(existingItem);
            }

            slot.appendChild(draggedItem);

            draggedItem.style.cursor = "default";
            draggedItem = null;

            /* Persistência pós-movimentação */
            saveInventory();
        });
    });

});




