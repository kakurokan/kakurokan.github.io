// localStorage que nunca rebenta (modo privado, cookies bloqueados…)
export const store = {
  get(key) { try { return localStorage.getItem(key); } catch (e) { return null; } },
  set(key, value) { try { localStorage.setItem(key, value); } catch (e) {} },
  del(key) { try { localStorage.removeItem(key); } catch (e) {} }
};
