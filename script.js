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

const serviceForm = document.getElementById("serviceForm");

if (serviceForm) {
  serviceForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = serviceForm.querySelector('[name="nombre"]')?.value?.trim();
const telefono = serviceForm.querySelector('[name="telefono"]')?.value?.trim();
const correo = serviceForm.querySelector('[name="correo"]')?.value?.trim();
const domicilio = serviceForm.querySelector('[name="domicilio"]')?.value?.trim();
const servicio = serviceForm.querySelector('[name="servicio"]')?.value;
const descripcion = serviceForm.querySelector('[name="problema"]')?.value?.trim();
    const fecha = serviceForm.querySelector('[name="fecha"]')?.value;
    const fotosInput = serviceForm.querySelector('input[type="file"]');
const fotos = fotosInput ? Array.from(fotosInput.files) : [];

    if (!nombre || !telefono || !correo || !domicilio || !servicio || !descripcion) {
      msg("Por favor completa todos los campos obligatorios.");
      return;
    }

    try {
      const respuesta = await fetch(
        `${SUPABASE_URL}solicitudes`,
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
// Subir fotografías a Supabase Storage
for (const foto of fotos) {
  const extension = foto.name.split(".").pop();
  const nombreArchivo = `${Date.now()}-${crypto.randomUUID()}.${extension}`;

  const subidaFoto = await fetch(
    `${SUPABASE_URL.replace(/\/rest\/v1\/?$/, "")}/storage/v1/object/solicitudes-fotos/${nombreArchivo}`,
    {
      method: "POST",
      headers: {
        apikey: SUPABASE_KEY,
        "Content-Type": foto.type,
        "x-upsert": "false"
      },
      body: foto
    }
  );

  if (!subidaFoto.ok) {
    const errorFoto = await subidaFoto.text();
    console.error("Error subiendo fotografía:", errorFoto);
    throw new Error("No se pudo subir una de las fotografías.");
  }
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
  techForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = techForm.querySelector('[name="nombre"]').value.trim();
    const telefono = techForm.querySelector('[name="telefono"]').value.trim();
    const correo = techForm.querySelector('[name="correo"]').value.trim();
    const ciudad = techForm.querySelector('[name="zona"]').value.trim();
    const especialidad = techForm.querySelector('[name="especialidad"]').value;
    const anosExperiencia = Number(
      techForm.querySelector('[name="experiencia"]').value
    );
    const cedula = techForm.querySelector('[name="cedula"]').value.trim();
    const disponibilidad = techForm.querySelector('[name="disponibilidad"]').value;
    const experienciaLaboral = techForm
      .querySelector('[name="experiencia_laboral"]')
      .value.trim();

    const herramienta =
      techForm.querySelector('[name="herramienta"]').value === "Sí";

    const vehiculo =
      techForm.querySelector('[name="vehiculo"]').value === "Sí";

    try {
      const respuesta = await fetch(
        `${SUPABASE_URL}postulaciones_tecnicos`,
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
  ciudad: ciudad,
  especialidad: especialidad,
  anos_experiencia: anosExperiencia,
  cedula_profesional: cedula || null,
  disponibilidad: disponibilidad,
  experiencia_laboral: experienciaLaboral,
  herramienta_propia: herramienta,
  vehiculo_propio: vehiculo,
  estado: "Nueva"
})
        }
      );

      if (!respuesta.ok) {
        const error = await respuesta.text();
        console.error("Error Supabase técnicos:", error);
        throw new Error(error);
      }

      msg("Solicitud enviada correctamente. MIRS revisará tu postulación.");
      techForm.reset();

    } catch (error) {
      console.error(error);
      msg("No se pudo enviar la postulación. Intenta nuevamente.");
    }
  });
}
