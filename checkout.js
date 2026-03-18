
document.addEventListener('DOMContentLoaded', () => {
  let cart = JSON.parse(localStorage.getItem('ilewaCart')) || [];
  const itemsEl = document.getElementById('checkoutItems');
  const subtotalEl = document.getElementById('sumSubtotal');
  const totalEl = document.getElementById('sumTotal');

  function render(){
    if(cart.length===0){
      itemsEl.innerHTML = '<p>Your bag is currently empty.</p>';
      subtotalEl.textContent = '$0.00';
      totalEl.textContent = '$0.00';
      return;
    }
    let subtotal = 0;
    itemsEl.innerHTML = cart.map(it => {
      const lt = it.price * it.qty;
      subtotal += lt;
      return `
      <div class="ci" data-id="${it.id}" data-shade="${it.shade||''}">
        <img src="${it.imgUrl}" alt="${it.name}"/>
        <div style="flex:1;">
          <div class="name">${it.name}</div>
          ${it.shade ? `<div>Shade: ${it.shade}</div>`:''}
          <div>$${it.price.toFixed(2)}</div>
          <div class="qtyctrl">
            <button class="minus">-</button><span>${it.qty}</span><button class="plus">+</button>
          </div>
        </div>
        <button class="remove"><i class="fas fa-trash-alt"></i></button>
      </div>`;
    }).join('');
    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    totalEl.textContent = `$${subtotal.toFixed(2)}`;
    localStorage.setItem('ilewaCart', JSON.stringify(cart));
  }

  itemsEl.addEventListener('click', (e) => {
    const ci = e.target.closest('.ci');
    if(!ci) return;
    const id = ci.getAttribute('data-id');
    const shade = ci.getAttribute('data-shade') || '';
    const idx = cart.findIndex(x => x.id===id && (x.shade||'')===shade);
    if(idx === -1) return;

    if(e.target.classList.contains('minus')){
      cart[idx].qty -= 1;
      if(cart[idx].qty <= 0){ cart.splice(idx,1); }
      render();
    }
    if(e.target.classList.contains('plus')){
      cart[idx].qty += 1; render();
    }
    if(e.target.closest('.remove')){
      cart.splice(idx,1); render();
    }
  });

  document.getElementById('proceedBtn').addEventListener('click', () => {
    alert('Proceeding to payment flow... (placeholder)');
  });

  render();
});
