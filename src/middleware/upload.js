import multer from 'multer'; 
import path from 'path'; 

// Configuración de destino y nombre único de archivo 
const storage = multer.diskStorage({ 
    destination: (req, file, cb) => { 
        cb(null, 'uploads/'); // Carpeta donde se guardan los archivos 
    }, 
    
    filename: (req, file, cb) => { 
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); 
        cb(null, uniqueSuffix + path.extname(file.originalname)); } 
    }); 
    
    // Filtro de formato (solo imágenes) 
    const fileFilter = (req, file, cb) => { 
        if (file.mimetype.startsWith('image/')) { 
            cb(null, true); 
        } else { 
            cb(new Error('Solo se permiten archivos de imagen'), false); 
        } }; 
        
export const upload = multer({ storage, fileFilter });