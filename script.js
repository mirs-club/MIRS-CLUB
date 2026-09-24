// ==========================================
// MIRS - CONEXIÓN CON SUPABASE
// ==========================================

const SUPABASE_URL = "https://wloijcecapbnxhngwdvy.supabase.co/rest/v1/";
const SUPABASE_KEY = "sb_publishable_6DApyskA1nYYgA1hCawNXw_qrymvaQE";

// ==========================================
// MENÚ
// ==========================================

const menu = document.getElementById("menu");
const nav = document.getElementById("nav");
const toast = document.getElementById("toast");

if (menu && nav) {
  menu.addEventListener("click", () => {
    nav.classList.toggle("open");
  });

  document.querySelectorAll("#nav a").forEach((a) => {
    a.addEventListener("click", () => nav.classList.remove("open"));
  });
}

// ==========================================
// MENSAJES
// ==========================================

function msg(text) {
  if (toast) {
    toast.textContent = text;
    toast.style.display = "block";

    setTimeout(() => {
      toast.style.display = "none";
    }, 3500);
  } else {
    alert(text);
  }
}

// ==========================================
// SOLICITUD DE SERVICIO
// ==========================================

const serviceForm = document.getElementById("ServiceForm");

if (serviceForm) {
  serviceForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = serviceForm.querySelector('[name="nombre"]')?.value?.trim();
    const telefono = serviceForm.querySelector('[name="telefono"]')?.value?.trim();
    const correo = serviceForm.querySelector('[name="Correo"]')?.value?.trim();
    const domicilio = serviceForm.querySelector('[name="Domicilio"]')?.value?.trim();
    const servicio = serviceForm.querySelector('[name="Servicio"]')?.value;
    const descripcion = serviceForm.querySelector('[name="problema"]')?.value?.trim();
    const fecha = serviceForm.querySelector('[name="fecha"]')?.value;

    if (!nombre || !telefono || !correo || !domicilio || !servicio || !descripcion) {
      msg("Por favor completa todos los campos obligatorios.");
      return;
    }

    try {
      const respuesta = await fetch(
        `${SUPABASE_URL}/rest/v1/solicitudes`,
        {
          method: "POST",
          headers: {
            apikey: SUPABASE_KEY,
            "Content-Type": "application/json",
            Prefer: "return=minimal"
          },
          body: JSON.stringify({
            nombre: nombre,
            telefono: telefono,
            correo: correo,
            domicilio: domicilio,
            servicio: servicio,
            descripcion: descripcion,
            fecha_preferida: fecha || null
          })
        }
      );

      if (!respuesta.ok) {
        const error = await respuesta.text();
        console.error("Error Supabase:", error);
        throw new Error(error);
      }

      msg("Solicitud enviada correctamente. MIRS se pondrá en contacto contigo.");

      serviceForm.reset();

    } catch (error) {
      console.error(error);
      msg("No se pudo enviar la solicitud. Intenta nuevamente.");
    }
  });
}

// ==========================================
// POSTULACIÓN DE TÉCNICOS
// Se conectará en el siguiente paso
// ==========================================

const techForm = document.getElementById("techForm");

if (techForm) {
  techForm.addEventListener("submit", (e) => {
    e.preventDefault();

    msg("Formulario de técnicos listo. Lo conectaremos enseguida.");
  });
}
