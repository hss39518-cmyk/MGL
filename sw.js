// The app has moved to https://mgl-ppc.web.app — this clears the old offline copy and sends open windows there.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil((async () => {
  try { const ks = await caches.keys(); await Promise.all(ks.map(k => caches.delete(k))); } catch (err) {}
  try { await self.registration.unregister(); } catch (err) {}
  try { const cs = await self.clients.matchAll({ type: "window" }); cs.forEach(c => { try { c.navigate("https://mgl-ppc.web.app/"); } catch (err) {} }); } catch (err) {}
})()));
