# digitalsignage.ai — versión de producción aprobada por Carlos (3-oct-2026, mañana)

Esta rama contiene **exactamente** los 26 ficheros del deployment de Cloudflare Pages
`68630724-5f95-4365-a07c-ebed3ac6abd2` (proyecto `digitalsignage-ai`), verificados uno a uno
contra el manifiesto de hashes de Cloudflare. Solo se añade este README.

- Es la versión de producción **aprobada por Carlos**.
- Estuvo en producción el 3-oct-2026 de **02:47 a 16:13** (hora de Madrid) y se **restauró a las 22:00**
  mediante rollback en Cloudflare Pages.
- Origen: subida directa de MorfeoMacMini, commit `0acabaac` («Inglés por defecto, portada en español
  y AdmiraNeXT»), que no estaba en GitHub.

## Importante

**La PR #1 / rama `smith/fase3-4877` no se debe desplegar a producción sin el OK explícito de Carlos.**
El 3-oct a las 16:13 se publicó en producción por subida directa y sustituyó esta portada; se revirtió.

## Desplegar

Esta es la rama por defecto. Un deploy manual reproduce la versión de la mañana:

    npx wrangler pages deploy . --project-name digitalsignage-ai --branch main

(Publica también este README.md como /README.md, que es inofensivo.)
