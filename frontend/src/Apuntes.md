# HOOKS DE ESTADO

Los **hooks** permiten a los componentes funcionales manejar el **estado** y otras funcionalidades que antes solo estaban disponibles en los componentes de clase.

### Sintaxis básica:

```js
const [state, setState] = useState(initialState);
```

Un hook se compone por una constante que entre corchetes debe contener el nombre de una variable, en la cual se va a almacenar el estado actual y una función setAlgo que va a ser la que actualice ese estado. A esa constante le asigno el estado actual, que lo debo definir con useState y va a ser lo que requiera cada hook, desde un booleano(true, false), hasta un stringt vacío. Ese va a ser el estado incial almacenado en la variable que he definido.

- **`state`**: El valor actual del estado.
- **`setState`**: Una función que actualiza el estado.
- **`initialState`**: El valor inicial que tendrá el estado cuando se monta el componente.

### Ejemplo en tsx:

```tsx
const [email, setEmail] = useState<string>(""); // Estado para el email
const [password, setPassword] = useState<string>(""); // Estado para la contraseña
const [error, setError] = useState<string | null>(null); // Estado para manejar los errores
```

En tsx se requiere determinar de antemano el tipo de dato con el que estoy trabajando, es decir, el tipo de dato que corresponde a ese estado.

En caso de no trabajar con tsx y sólo trabajar con js sería:

```js
const [email, setEmail] = useState(""); // Estado para el email
const [password, setPassword] = useState(""); // Estado para la contraseña
const [error, setError] = useState(null); // Estado para manejar los errores
```

### Ejemplos de manejo de estado con diferentes tipos de datos en distintos contextos:

#### 1. **Formulario: Manejo con un string vacío**:

Para un formulario, como por ejemplo el campo de **email** o **password**, inicializar el estado como un string vacío `""`. Después de que el usuario envíe el formulario, **restablecer** esos campos a un string vacío de nuevo.

**Ejemplo:**

```js
const [email, setEmail] = useState(""); // Inicializar el email vacío
const [password, setPassword] = useState(""); // Inicializar el password vacío

const handleSubmit = (event) => {
  event.preventDefault(); //para que no se refresque la página al enviar el form

  // Enviar el formulario aquí mediante solicitud POST al back

  // Restablecer los campos a vacío después del envío
  setEmail("");
  setPassword("");
};
```

#### 2. **Login: Manejo con un booleano**:

Para el **login**, usar un **booleano** para determinar si el usuario está o no logueado. Por ejemplo, al inicio el estado podría ser `false` y una vez que el login sea exitoso, se actualiza a `true`.

**Ejemplo:**

```tsx
const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // Inicializa como no logueado (false)

const handleLogin = async () => {
  try {
    setIsLoggedIn(true); // Cambia a true si el login fue exitoso
  } catch (error) {
    setIsLoggedIn(false); // Si falla el login, sigue como false
  }
};
```

```js
const [isLoggedIn, setIsLoggedIn] = useState(false); // Inicializa como no logueado (false)

const handleLogin = async () => {
  try {
    setIsLoggedIn(true); // Cambia a true si el login fue exitoso
  } catch (error) {
    setIsLoggedIn(false); // Si falla el login, sigue como false
  }
};
```

#### 3. **Manejo de múltiples campos en un objeto**:

Para manejar formularios con **múltiples campos**, usar un **objeto** (formData) en el estado.

**Ejemplo:**

```tsx
interface FormData {
  email: string;
  password: string;
}

const [formData, setFormData] = useState<FormData>({
  // Importante: formdata requiere una interfaz o tipado explícito, en la que defino los campos y el tipo de datos que va a contener ese objeto formData además de definirlo aquí en el hook

  email: "",
  password: "",
});

const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //debo indicar el tipo del elemento, React.ChangeEvent para tipos de entrada como input, text, select
  const { name, value } = event.target;
  setFormData({
    ...formData, // Copia el estado actual
    [name]: value, // Actualiza solo el campo que cambió
  });
};

const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  //React.FormEvent para envío de formularios completos, normalmente con botón submit
  event.preventDefault();

  // Lógica en la que se envían los datos

  // Restablecer el formulario
  setFormData({ email: "", password: "" });
};
```

```js
const [formData, setFormData] = useState({
  email: "",
  password: "",
});

const handleInputChange = (event) => {
  //requiere que se defina el tipo de evento, podrían ser otros como  HTMLTextAreaElement,  HTMLSelectElement
  const { name, value } = event.target; //constante q almacena esos dos datos (mediante desestructuración) que se ingresan en el input. Los van a almacenar en las variables name y value. O sea que al desestructurar elijo los valores que quiero y los pongo entre llaves y estos se van a almacenar en variables con el mismo nombre
  setFormData({
    ...formData, // Copia el estado actual
    [name]: value, // Actualiza solo el campo que cambió, [name] indica el campo actual
  });
};

const handleSubmit = (event) => {
  event.preventDefault();

  // Lógica en la que se envían los datos

  // Restablecer el formulario
  setFormData({ email: "", password: "" });
};
```

En este caso, cuando el usuario escribe en los campos de entrada, el estado se actualiza dinámicamente en función del nombre [name] del campo (`email` o `password`).

---

# ¿Qué son las propiedades computadas en JavaScript?

En JavaScript, es posible crear objetos y definir sus propiedades de manera estática o dinámica.

### Las propiedades estáticas son las que se definen directamente:

**Ejemplo**

```js
const obj = {
  admin_name: "Tom",
};
```

Aquí, el nombre de la propiedad es admin_name, y su valor es "Tom".

Sin embargo, a veces necesitamos que el nombre de la propiedad no sea fijo, sino que se calcule dinámicamente dependiendo de algún valor, por ejemplo, lo que el usuario esté escribiendo en un formulario. Para esto, utilizamos las propiedades computadas (o dinámicas), que se definen dentro de corchetes ([]).

### Uso de [] para propiedades computadas (dinámicas):

Cuando usamos los corchetes ([]) en un objeto, le estamos diciendo a JavaScript que queremos que el nombre de la propiedad sea el valor de lo que está dentro de esos corchetes.

Es decir, en lugar de tener un nombre de propiedad fijo, estamos obteniendo el nombre de la propiedad dinámicamente desde el formulario, por ejemplo.

**Ejemplo**

```tsx
setFormData({ ...formData, [e.target.name]: e.target.value });
```

1. [e.target.name]:

e.target.name: Hace referencia al nombre del campo de formulario que el usuario está modificando. Este nombre está definido en el atributo name de cada campo de formulario, por ejemplo:

```html
<input type="text" name="admin_name" />
<input type="email" name="admin_email" />
```

Dependiendo de cuál campo el usuario esté interactuando, e.target.name será "admin_name" o "admin_email", o cualquier otro nombre de campo que tengamos en el formulario.

Al poner [e.target.name] entre corchetes, estamos diciéndole a JavaScript que el nombre de esa propiedad será el campo correspondiente al input con el que se está interactuando.

Si e.target.name es "admin_name", entonces el objeto será:

```js
{
  admin_name: e.target.value;
}
```

Si e.target.name es "admin_email", el objeto se verá así:

```js
Copiar código
{
  admin_email: e.target.value
}
```

El uso de corchetes le permite a JavaScript calcular qué propiedad del objeto es la que debe actualizar, en función de dónde se ubica e.target.value en cada interacción.

### ¿Por qué no usamos e.target.name directamente sin los corchetes?

Sin los corchetes, JavaScript trataría e.target.name como una propiedad literal en lugar de un valor dinámico.

JavaScript no entenderá que "e.target.name" es una variable que contiene el nombre del campo. En cambio, pensará que la propiedad literal del objeto es e.target.name, y no funcionará.
________________________________________________________________________
# Hooks de navegación

### Propósito: 

Se utiliza para redireccionar a una ruta diferente dentro de la aplicación cuando usamos React Router.

### Sintaxis: 

Solo devuelve una función, no una dupla (un array con dos elementos) como useState. Esa función permite realizar la redirección.

```js
const navigate = useNavigate(); // navigate es la función de redirección
```

__________________________________________________________________________________
# Usar <form> con onSubmit o <input> con eventos como onClick o onKeyDown:

## <form> con onSubmit:

Está diseñado específicamente para formularios. Esto es útil cuando necesitas capturar y manejar el envío de un formulario completo, incluso si hay varios campos de entrada.

## usar un formulario (<form>) para la barra de búsqueda: 

Permite manejar la búsqueda cuando el formulario es enviado, lo que incluye detectar la tecla "Enter" o el botón "Submit".

Búsqueda con múltiples palabras: En un formulario, al presionar "Enter" o hacer clic en un botón de envío, toda la cadena (incluidas las palabras separadas por espacios) se captura y se maneja correctamente.

## <input> con onClick o onKeyDown:

El evento onClick es específico para manejar clics en botones, íconos, etc., mientras que onKeyDown detecta las teclas presionadas.

No hay ninguna limitación en la búsqueda de varias palabras, ya que puedes seguir capturando el texto completo del campo de entrada, incluyendo las palabras con espacios.

Sería prácticamente lo mismo usar un <form> con onSubmit o un <input> con onKeyDown o onClick. La diferencia clave está en cómo se maneja el evento, pero el resultado final (realizar una búsqueda) sería el mismo en ambos casos