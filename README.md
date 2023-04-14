# WebSockets

Incluir un canal de chat entre los clientes y el servidor. Donde:

- En la parte inferior del formulario de ingreso se presentará el centro de mensajes almacenados en el servidor, donde figuren los mensajes de todos los usuarios identificados por su email.
- El formato a representar será: email (texto negrita en azul) [fecha y hora (DD/MM/YYYY HH:MM:SS)](texto normal en marrón) : mensaje (texto italic en verde).
- Además incorporar dos elementos de entrada: uno para que el usuario ingrese su email (obligatorio para poder utilizar el chat) y otro para ingresar mensajes y enviarlos mediante un botón.

# Inicio de sesión

Implementar un mecanismo de autenticación.

Se incluirá una vista de registro, en donde se pidan email y contraseña. Estos datos se persistirán usando MongoDb, en una (nueva) colección de usuarios, cuidando que la contraseña quede encriptada (sugerencia: usar la librería bcrypt).

Cada una de las vistas (logueo - registro) deberá tener un botón para ser redirigido a la otra.

Una vez logueado el usuario, se lo redirigirá al inicio, el cual ahora mostrará también su email, y un botón para desolguearse.

Además, se activará un espacio de sesión controlado por la sesión de passport. Esta estará activa por 10 minutos y en cada acceso se recargará este tiempo.

Agregar también vistas de error para login (credenciales no válidas) y registro (usuario ya registrado).

# Dotenv

Mover todas las claves y credenciales utilizadas a un archivo .env, y cargarlo mediante la librería dotenv.

La única configuración que no va a ser manejada con esta librería va a ser el puerto de escucha del servidor. Éste deberá ser leído de los argumento pasados por línea de comando, usando alguna librería (minimist o yargs). En el caso de no pasar este parámetro por línea de comandos, conectar por defecto al puerto 8080.

## Aspectos a incluir

Agregar una ruta '/info' que presente en una vista sencilla los siguientes datos:

- Argumentos de entrada.
- Nombre de la plataforma (sistema operativo).
- Versión de node.js.
- Memoria total reservada (rss).
- Path de ejecución.
- Process id.
- Carpeta del proyecto.

Agregar otra ruta '/api/randoms' que permita calcular un cantidad de números aleatorios en el rango del 1 al 1000 especificada por parámetros de consulta (query).
Por ej: /randoms?cant=20000.

Si dicho parámetro no se ingresa, calcular 100.000.000 números.
El dato devuelto al frontend será un objeto que contendrá como claves los números random generados junto a la cantidad de veces que salió cada uno. Esta ruta no será bloqueante (utilizar el método fork de child process). Comprobar el no bloqueo con una cantidad de 500.000.000 de randoms.

# Dividir en Capas el Proyecto

Dividir en capas el proyecto entregable que se viene realizando, agrupando apropiadamente las capas de ruteo, controlador, lógica de negocio y persistencia.
Agrupar las rutas por funcionalidad, con sus controladores, lógica de negocio con los casos de uso, y capa de persistencia.

La capa de persistencia contendrá los métodos necesarios para atender la interacción de la lógica de negocio con los propios datos.

# Mejorar la arquitectura de la API

- Modificar la capa de persistencia incorporando los conceptos de Factory, DAO, y DTO.
- Los DAOs deben presentar la misma interfaz hacia la lógica de negocio de nuestro servidor.
- El DAO seleccionado (por un parámetro en línea de comandos como lo hicimos anteriormente) será devuelto por una Factory para que la capa de negocio opere con el.
- Cada uno de estos casos de persistencia, deberán ser implementados usando el patrón singleton que impida crear nuevas instancias de estos mecanismos de acceso a los datos.
- Comprobar que si llamo a la factory dos veces, con una misma opción elegida, devuelva la misma instancia.
