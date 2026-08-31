import 'dotenv/config';

import {
    Producto,
    Usuario,
    Administrador,
    Categoria,
    sequelize,
} from '../src/models/index.js';

const categoriasSeed = [
    { nombre: 'Procesadores', descripcion: 'CPUs Intel y AMD' },
    { nombre: 'Motherboards', descripcion: 'Placas madre compatibles' },
    { nombre: 'Coolers', descripcion: 'Refrigeración líquida y por aire' },
    { nombre: 'Memorias RAM', descripcion: 'Módulos de memoria RAM DDR4 y DDR5' },
    { nombre: 'Placas de Video', descripcion: 'GPUs NVIDIA y AMD' },
    { nombre: 'Almacenamiento', descripcion: 'Discos SSD NVMe y HDD' },
    { nombre: 'Fuentes', descripcion: 'Fuentes de alimentación certificadas' },
    { nombre: 'Gabinetes', descripcion: 'Chasis con flujo de aire y RGB' },
    { nombre: 'Monitores', descripcion: 'Pantallas Gaming de alta tasa de refresco' },
    { nombre: 'Perifericos', descripcion: 'Teclados, mouses y auriculares' }
];

const administradoresSeed = [
    {
        nombre: 'Juan',
        apellido: 'Perez',
        email: 'juanadmin@gmail.com',
        password: 'admin-contraseña-2026',
        legajoEmpleado: 'LEG-001',
        nivelPermiso: 'SuperAdmin'
    }
];

const clientesSeed = [
    {
        nombre: 'Cliente',
        apellido: 'Prueba',
        email: 'cliente@example.com',
        password: 'cliente123',
        fechaRegistro: new Date()
    }
];

const productosSeed = [
    {
        categoriaIndex: 0,
        nombre: 'Procesador AMD Ryzen 3 4100',
        descripcion: 'Ideal para jugadores y creadores de contenido. 4 núcleos, 8 hilos. Socket AM4.',
        precio: 96500.00,
        stock: 15,
        socketCompatibilidad: 'AM4',
        especificacionesTecnicas: 'Frecuencia base 3.8 GHz, Cache 4MB'
    },
    {
        categoriaIndex: 0,
        nombre: 'Intel Core i9-14900Kf',
        descripcion: 'Máximo rendimiento para gaming entusiasta y streaming.',
        precio: 1798170.00,
        stock: 4,
        socketCompatibilidad: 'LGA1700'
    },
    {
        categoriaIndex: 4,
        nombre: 'Placa de Video ASUS RTX 4070 Dual 12GB',
        descripcion: 'Arquitectura NVIDIA Ada Lovelace, trazado de rayos y DLSS 3.',
        precio: 850000.00,
        stock: 8,
        socketCompatibilidad: 'PCIe 4.0'
    },
    {
        categoriaIndex: 0,
        nombre: 'Procesador AMD Ryzen 5 5600X',
        descripcion: 'Excelente equilibrio para gaming en 1080p. 6 núcleos, 12 hilos.',
        precio: 245000.00,
        stock: 20,
        socketCompatibilidad: 'AM4',
        especificacionesTecnicas: 'Frecuencia base 3.7 GHz, Cache 32MB'
    },
    {
        categoriaIndex: 1,
        nombre: 'Motherboard ASUS Prime B550M-A',
        descripcion: 'Placa madre micro-ATX compatible con procesadores AMD de arquitectura AM4.',
        precio: 135000.00,
        stock: 12,
        socketCompatibilidad: 'AM4',
        especificacionesTecnicas: 'Soporta DDR4 hasta 4800MHz, PCIe 4.0 x16'
    },
    {
        categoriaIndex: 1,
        nombre: 'Motherboard Gigabyte Z790 AORUS ELITE',
        descripcion: 'Placa madre de gama alta para exprimir el potencial de la 14va generación de Intel.',
        precio: 410000.00,
        stock: 6,
        socketCompatibilidad: 'LGA1700',
        especificacionesTecnicas: 'Soporta DDR5, 4 ranuras M.2 NVMe, Wi-Fi 6E'
    },
    {
        categoriaIndex: 4,
        nombre: 'Placa de Video AMD Radeon RX 7600 XT 16GB',
        descripcion: 'Gran capacidad de VRAM para texturas en Ultra y edición de video fluida.',
        precio: 495000.00,
        stock: 10,
        socketCompatibilidad: 'PCIe 4.0'
    },
    {
        categoriaIndex: 3,
        nombre: 'Memoria RAM DDR5 16GB Corsair Vengeance',
        descripcion: 'Módulo de memoria de última generación a 5600MHz optimizado para Intel y AMD.',
        precio: 89000.00,
        stock: 25,
        socketCompatibilidad: 'DIMM'
    },
    {
        categoriaIndex: 5,
        nombre: 'Disco SSD NVMe M.2 1TB WD Black SN770',
        descripcion: 'Almacenamiento de alta velocidad con tasas de lectura de hasta 5150 MB/s.',
        precio: 105000.00,
        stock: 40,
        socketCompatibilidad: 'M.2 PCIe'
    },
    {
        categoriaIndex: 6,
        nombre: 'Fuente Corsair RM750e 750W',
        descripcion: 'Fuente de alimentación modular con certificación 80 Plus Gold de alta eficiencia.',
        precio: 185000.00,
        stock: 14,
        socketCompatibilidad: 'ATX'
    },
    {
        categoriaIndex: 7,
        nombre: 'Gabinete Lian Li Lancool 216 RGB',
        descripcion: 'Chasis moderno con excelente flujo de aire, incluye dos ventiladores frontales de 160mm.',
        precio: 140000.00,
        stock: 9,
        socketCompatibilidad: 'ATX / Micro-ATX'
    },
    {
        categoriaIndex: 3,
        nombre: 'Memoria RAM DDR4 32GB Kingston Fury',
        descripcion: 'Módulo de alta velocidad de 3200MHz.',
        precio: 112000.00,
        stock: 30,
        socketCompatibilidad: 'DIMM'
    }
];

const runSeed = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexión a la base de datos establecida.');

        await sequelize.sync({ force: true });
        console.log('Tablas sincronizadas y creadas correctamente.');

        const categoriasCreadas = [];
        for (const item of categoriasSeed) {
            const [categoria, created] = await Categoria.findOrCreate({
                where: { nombre: item.nombre },
                defaults: item,
            });
            categoriasCreadas.push(categoria);
            console.log(created ? `Categoría creada: ${categoria.nombre}` : `Categoría ya existe: ${categoria.nombre}`);
        }

        for (const item of administradoresSeed) {
            const [admin, created] = await Administrador.findOrCreate({
                where: { email: item.email },
                defaults: item,
            });
            console.log(created ? `Administrador creado: ${admin.email}` : `Administrador ya existe: ${admin.email}`);
        }

        for (const item of clientesSeed) {
            const [cliente, created] = await Usuario.findOrCreate({
                where: { email: item.email },
                defaults: item,
            });
            console.log(created ? `Cliente creado: ${cliente.email}` : `Cliente ya existe: ${cliente.email}`);
        }

        for (const prod of productosSeed) {
            const { categoriaIndex, ...datosProducto } = prod;
            const categoria = categoriasCreadas[categoriaIndex];

            if (categoria) {
                const [producto, created] = await Producto.findOrCreate({
                    where: { nombre: datosProducto.nombre },
                    defaults: { ...datosProducto, idCategoria: categoria.id },
                });
                console.log(created ? `Producto creado: ${producto.nombre}` : `Producto ya existe: ${producto.nombre}`);
            }
        }

        console.log('Seed completado correctamente.');
    } catch (error) {
        console.error('Error al ejecutar el seed:', error);
    } finally {
        await sequelize.close();
    }
};

runSeed();