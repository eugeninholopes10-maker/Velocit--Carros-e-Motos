// Banco de Dados de Veículos do Estoque
const vehicles = [
    {
        id: 1,
        title: "Porsche 911 Carrera S",
        type: "car",
        brand: "Porsche",
        price: 980000,
        year: 2023,
        km: "12.000 km",
        fuel: "Gasolina",
        transmission: "PDK 8 marchas",
        image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80",
        description: "Motor 3.0 Boxer Bi-Turbo de 450cv. Pacote Sport Chrono, escapamento esportivo original, teto solar em carbono e bancos adaptativos 18 vias."
    },
    {
        id: 2,
        title: "BMW M4 Competition",
        type: "car",
        brand: "BMW",
        price: 750000,
        year: 2022,
        km: "18.500 km",
        fuel: "Gasolina",
        transmission: "Automático",
        image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80",
        description: "Motor 3.0 TwinPower Turbo 510cv. Freios de cerâmica, interior em couro Merino Silverstone e detalhes em fibra de carbono."
    },
    {
        id: 3,
        title: "Kawasaki Ninja ZX-10R",
        type: "moto",
        brand: "Kawasaki",
        price: 115000,
        year: 2024,
        km: "0 km",
        fuel: "Gasolina",
        transmission: "Manual 6 marchas",
        image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80",
        description: "Motor 998cc inline-4 com 203cv. Quickshifter bidirecional, controle de tração S-KTRC, modos de pilotagem integrados e painel TFT."
    },
    {
        id: 4,
        title: "BMW S1000RR M Package",
        type: "moto",
        brand: "BMW",
        price: 138000,
        year: 2023,
        km: "4.200 km",
        fuel: "Gasolina",
        transmission: "Manual 6 marchas",
        image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80",
        description: "207cv com ShiftCam. Rodas em fibra de carbono M, bateria M leve, banco M e escapamento de titânio Akrapovic de fábrica."
    },
    {
        id: 5,
        title: "Mercedes-AMG G63",
        type: "car",
        brand: "Mercedes-Benz",
        price: 1450000,
        year: 2022,
        km: "22.000 km",
        fuel: "Gasolina",
        transmission: "Automático 9G-Tronic",
        image: "https://images.unsplash.com/photo-1520031441872-265e4ff70845?auto=format&fit=crop&w=800&q=80",
        description: "V8 4.0 Bi-Turbo de 585cv. Sistema de som Burmester 3D, Night Package, faróis Multibeam LED e acabamento interno personalizado Nappa."
    },
    {
        id: 6,
        title: "Ducati Panigale V4 S",
        type: "moto",
        brand: "Ducati",
        price: 162000,
        year: 2023,
        km: "2.800 km",
        fuel: "Gasolina",
        transmission: "Manual 6 marchas",
        image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80",
        description: "Desmosedici Stradale V4 de 214cv. Suspensão eletrônica Öhlins, rodas forjadas Marchesini e asas aerodinâmicas de carbono."
    }
];

// Estado da Aplicação
let currentCategory = 'all';
let cart = [];

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    populateBrandOptions();
    renderVehicles(vehicles);
    calculateFinancing();
});

// Preencher marcas dinamicamente no Select
function populateBrandOptions() {
    const brandSelect = document.getElementById('brandSelect');
    const brands = [...new Set(vehicles.map(v => v.brand))].sort();
    
    brands.forEach(brand => {
        const option = document.createElement('option');
        option.value = brand;
        option.textContent = brand;
        brandSelect.appendChild(option);
    });
}

// Filtro de Categoria
function setCategoryFilter(category) {
    currentCategory = category;
    
    document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
    if(category === 'all') document.getElementById('btnTypeAll').classList.add('active');
    if(category === 'car') document.getElementById('btnTypeCar').classList.add('active');
    if(category === 'moto') document.getElementById('btnTypeMoto').classList.add('active');

    applyFilters();
}

// Atualizar valor exibido do slider
function updatePriceLabel() {
    const price = document.getElementById('priceRange').value;
    document.getElementById('priceLabel').textContent = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(price);
}

// Aplicar Filtros Combinados
function applyFilters() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const selectedBrand = document.getElementById('brandSelect').value;
    const selectedFuel = document.getElementById('fuelSelect').value;
    const maxPrice = parseFloat(document.getElementById('priceRange').value);

    const filtered = vehicles.filter(v => {
        const matchesCategory = currentCategory === 'all' || v.type === currentCategory;
        const matchesSearch = v.title.toLowerCase().includes(searchTerm) || v.brand.toLowerCase().includes(searchTerm);
        const matchesBrand = !selectedBrand || v.brand === selectedBrand;
        const matchesFuel = !selectedFuel || v.fuel === selectedFuel;
        const matchesPrice = v.price <= maxPrice;

        return matchesCategory && matchesSearch && matchesBrand && matchesFuel && matchesPrice;
    });

    renderVehicles(filtered);
}

// Renderizar Cards de Veículos
function renderVehicles(list) {
    const grid = document.getElementById('vehicleGrid');
    grid.innerHTML = '';

    if (list.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full text-center py-12 text-slate-500">
                <i data-lucide="car-off" class="w-12 h-12 mx-auto mb-3 text-slate-600"></i>
                <p class="text-lg font-bold">Nenhum veículo encontrado com os filtros selecionados.</p>
            </div>
        `;
        lucide.createIcons();
        return;
    }

    list.forEach(v => {
        const formattedPrice = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v.price);
        
        const card = document.createElement('div');
        card.className = "bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-red-600/50 transition-all duration-300 flex flex-col group shadow-xl";
        
        card.innerHTML = `
            <div class="relative overflow-hidden h-52">
                <img src="${v.image}" alt="${v.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                <span class="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-xs font-bold px-3 py-1.5 rounded-full text-red-400 border border-slate-800 uppercase tracking-wider">
                    ${v.type === 'car' ? 'Carro' : 'Moto'}
                </span>
            </div>
            
            <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                    <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">${v.brand}</span>
                    <h3 class="text-xl font-bold text-white mt-1 group-hover:text-red-500 transition">${v.title}</h3>
                    
                    <div class="grid grid-cols-2 gap-2 mt-4 text-xs text-slate-400 border-y border-slate-800/80 py-3">
                        <div class="flex items-center space-x-1.5">
                            <i data-lucide="calendar" class="w-4 h-4 text-slate-500"></i>
                            <span>Ano: ${v.year}</span>
                        </div>
                        <div class="flex items-center space-x-1.5">
                            <i data-lucide="gauge" class="w-4 h-4 text-slate-500"></i>
                            <span>${v.km}</span>
                        </div>
                        <div class="flex items-center space-x-1.5">
                            <i data-lucide="fuel" class="w-4 h-4 text-slate-500"></i>
                            <span>${v.fuel}</span>
                        </div>
                        <div class="flex items-center space-x-1.5">
                            <i data-lucide="settings" class="w-4 h-4 text-slate-500"></i>
                            <span class="truncate">${v.transmission}</span>
                        </div>
                    </div>
                </div>

                <div class="flex items-center justify-between pt-2">
                    <div>
                        <span class="text-xs text-slate-500 block">Preço à vista</span>
                        <span class="text-2xl font-black text-white">${formattedPrice}</span>
                    </div>
                    
                    <button onclick="openDetailsModal(${v.id})" class="bg-red-600 hover:bg-red-700 text-white p-3 rounded-xl transition shadow-lg shadow-red-600/20">
                        <i data-lucide="chevron-right" class="w-5 h-5"></i>
                    </button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
    
    lucide.createIcons();
}

// Abrir Modal com Detalhes
function openDetailsModal(id) {
    const vehicle = vehicles.find(v => v.id === id);
    if (!vehicle) return;

    const formattedPrice = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(vehicle.price);
    const modalContent = document.getElementById('modalContent');

    modalContent.innerHTML = `
        <div class="grid md:grid-cols-2 gap-6">
            <img src="${vehicle.image}" alt="${vehicle.title}" class="rounded-xl w-full h-72 object-cover border border-slate-800">
            <div class="space-y-4">
                <span class="bg-red-600/20 text-red-500 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">${vehicle.brand}</span>
                <h2 class="text-3xl font-black text-white">${vehicle.title}</h2>
                <div class="text-3xl font-black text-red-500">${formattedPrice}</div>
                <p class="text-slate-400 text-sm leading-relaxed">${vehicle.description}</p>
                
                <div class="flex flex-col sm:flex-row gap-3 pt-4">
                    <button onclick="addToCart(${vehicle.id})" class="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition flex items-center justify-center space-x-2">
                        <i data-lucide="bookmark" class="w-5 h-5"></i>
                        <span>Adicionar às Reservas</span>
                    </button>
                    <a href="https://wa.me/5562993669106?text=Olá,%20tenho%20interesse%20no%20${encodeURIComponent(vehicle.title)}" target="_blank" class="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition flex items-center justify-center space-x-2">
                        <i data-lucide="message-circle" class="w-5 h-5"></i>
                        <span>Atendimento Direto</span>
                    </a>
                </div>
            </div>
        </div>
    `;

    document.getElementById('detailsModal').classList.remove('hidden');
    lucide.createIcons();
}

function closeDetailsModal() {
    document.getElementById('detailsModal').classList.add('hidden');
}

// Gerenciamento do Carrinho / Proposta
function toggleCartDrawer() {
    const drawer = document.getElementById('cartDrawer');
    drawer.classList.toggle('translate-x-full');
}

function addToCart(id) {
    const vehicle = vehicles.find(v => v.id === id);
    if (!vehicle) return;

    if (!cart.some(item => item.id === id)) {
        cart.push(vehicle);
        updateCartUI();
        closeDetailsModal();
        toggleCartDrawer();
    } else {
        alert("Este veículo já está em sua lista de reserva!");
    }
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
}

function updateCartUI() {
    document.getElementById('cartCount').textContent = cart.length;
    const itemsList = document.getElementById('cartItemsList');
    itemsList.innerHTML = '';

    let totalDeposit = 0;

    if (cart.length === 0) {
        itemsList.innerHTML = `
            <div class="text-center py-12 text-slate-500">
                <i data-lucide="shopping-bag" class="w-12 h-12 mx-auto mb-2 opacity-50"></i>
                <p>Nenhum veículo selecionado.</p>
            </div>
        `;
        document.getElementById('cartTotal').textContent = 'R$ 0';
        lucide.createIcons();
        return;
    }

    cart.forEach(item => {
        totalDeposit += item.price * 0.10; // Sinal de reserva de 10%
        const formattedPrice = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(item.price);

        const div = document.createElement('div');
        div.className = "flex items-center space-x-4 bg-slate-950 p-3 rounded-xl border border-slate-800";
        div.innerHTML = `
            <img src="${item.image}" class="w-16 h-16 rounded-lg object-cover">
            <div class="flex-1 min-w-0">
                <h4 class="text-sm font-bold text-white truncate">${item.title}</h4>
                <span class="text-xs text-slate-400">${formattedPrice}</span>
            </div>
            <button onclick="removeFromCart(${item.id})" class="text-slate-500 hover:text-red-500 p-1">
                <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
        `;
        itemsList.appendChild(div);
    });

    document.getElementById('cartTotal').textContent = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(totalDeposit);
    lucide.createIcons();
}

function checkoutCart() {
    if (cart.length === 0) {
        alert("Sua lista de interesse está vazia.");
        return;
    }

    let message = "Olá! Gostaria de consultar a disponibilidade dos seguintes veículos:\n\n";
    cart.forEach((v, index) => {
        message += `${index + 1}. ${v.title} (${v.year}) - R$ ${v.price.toLocaleString('pt-BR')}\n`;
    });

    window.open(`https://wa.me/5562993669106?text=${encodeURIComponent(message)}`, '_blank');
}

// Simulador de Financiamento
function calculateFinancing() {
    const val = parseFloat(document.getElementById('simVal').value) || 0;
    const entry = parseFloat(document.getElementById('simEntry').value) || 0;
    const months = parseInt(document.getElementById('simMonths').value);

    const financed = Math.max(0, val - entry);
    const rate = 0.0129; // 1,29% a.m.
    
    let monthly = 0;
    if (financed > 0) {
        monthly = (financed * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
    }

    const formattedMonthly = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(monthly);
    document.getElementById('simResult').textContent = `${formattedMonthly} / mês`;
}

function requestFinancingContact() {
    const val = document.getElementById('simVal').value;
    const entry = document.getElementById('simEntry').value;
    const months = document.getElementById('simMonths').value;
    
    const msg = `Olá! Fiz uma simulação no site para um veículo de R$ ${val} com entrada de R$ ${entry} em ${months}x. Gostaria de enviar meus dados para análise de crédito.`;
    window.open(`https://wa.me/5562993669106?text=${encodeURIComponent(msg)}`, '_blank');
}

// Reset de Filtros ao clicar no Logo
function resetFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('brandSelect').value = '';
    document.getElementById('fuelSelect').value = '';
    document.getElementById('priceRange').value = 1500000;
    updatePriceLabel();
    setCategoryFilter('all');
}
// Envio do formulário de Avaliação de Usado (Trade-in)
function sendTradeProposal() {
    const model = document.getElementById('tradeModel').value;
    const km = document.getElementById('tradeKm').value;
    const details = document.getElementById('tradeDetails').value;

    if (!model) {
        alert("Por favor, informe o modelo do seu veículo.");
        return;
    }

    const msg = `Olá! Gostaria de solicitar uma avaliação para troca:\n\nVeículo: ${model}\nQuilometragem: ${km}\nDetalhes: ${details}`;
    window.open(`https://wa.me/5562993669106?text=${encodeURIComponent(msg)}`, '_blank');
}