
        let items = [];

        window.onload = () => {
            const cookieData = getCookie("food_tracker_data");
            if (cookieData) {
                items = JSON.parse(cookieData);
                renderItems();
            }
        };

        function setCookie(name, value) {
            const d = new Date();
            d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000));
            document.cookie = name + "=" + JSON.stringify(value) + ";expires=" + d.toUTCString() + ";path=/";
        }

        function getCookie(name) {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
        }

        function addItem() {
            const name = document.getElementById('itemName').value;
            const date = document.getElementById('expDate').value;
            if (!name || !date) return;

            items.push({ name, expiration_date: date });
            setCookie("food_tracker_data", items);
            
            document.getElementById('itemName').value = "";
            document.getElementById('expDate').value = "";
            renderItems();
        }

        function deleteItem(index) {
            items.splice(index, 1);
            setCookie("food_tracker_data", items);
            renderItems();
        }

        function renderItems() {
            const container = document.getElementById('itemsContainer');
            const searchTerm = document.getElementById('searchInput').value.toLowerCase();
            container.innerHTML = "";

            const filteredItems = items
                .filter(item => item.name.toLowerCase().includes(searchTerm))
                .sort((a, b) => new Date(a.expiration_date) - new Date(b.expiration_date));

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            filteredItems.forEach((item) => {
                const expDate = new Date(item.expiration_date);
                const diffDays = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));

                let statusText = "Active";
                let statusClass = "text-gray-500";
                let borderClass = "border-gray-800";
                
                if (diffDays < 0) {
                    statusText = "Expired";
                    statusClass = "text-red-500";
                    borderClass = "border-red-900/30 bg-red-950/10";
                } else if (diffDays <= 3) {
                    statusText = "Urgent";
                    statusClass = "text-orange-500";
                    borderClass = "border-orange-900/30 bg-orange-950/10";
                }

                container.innerHTML += `
                    <div class="bg-gray-900/50 border ${borderClass} p-4 flex justify-between items-center">
                        <div>
                            <div class="font-normal text-gray-200">${item.name}</div>
                            <div class="text-[10px] uppercase tracking-widest mt-1">
                                <span class="text-gray-600">Expires: ${item.expiration_date}</span> 
                                <span class="mx-2 text-gray-800">|</span> 
                                <span class="${statusClass}">${statusText} (${diffDays} days)</span>
                            </div>
                        </div>
                        <button onclick="deleteItem(${items.indexOf(item)})" 
                            class="text-[10px] font-bold text-gray-600 hover:text-gray-200 transition uppercase tracking-tighter">
                            Remove
                        </button>
                    </div>
                `;
            });
        }
