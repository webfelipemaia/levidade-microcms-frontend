// stores/upload.js
import { defineStore } from 'pinia';
import axios from 'axios';

export const useUploadStore = defineStore('upload', {
  state: () => ({
    
    files: null,
    uploadedFiles: [],
    uploadProgress: 0,
    error: null,
    message: null,
  }),

  actions: {
    async upload() {
    
        let formData = new FormData();      
        const file = this.files[0];
        const maxFileSize = 2 * 1024 * 1024;
        
        if(!file) return;

        if(file.size > maxFileSize) {
          this.error = 'Could not upload the file: file too large'
        } else {
        
          const fileName = (file.name.length >= 12) ? 
                            file.name.substring(0,13) + '... .' + file.name.split('.')[1] : 
                            file.name;

          formData.append('files',file);
      
          this.uploadProgress = 0;
          this.uploadedFiles.push({ name: fileName, loading: 0 });
          this.showProgress = true;
            
          try {
            const response = await axios.post('/files/upload/', formData, {
              onUploadProgress: ({loaded, total}) => {
                this.uploadedFiles[this.files.length - 1].loading = Math.floor((loaded/total)*100);
                this.uploadProgress = Math.floor((loaded/total)*100);
                if(loaded == total){
                  const fileSize = (total < 1024) ? 
                    total + 'KB': 
                    (loaded / (1024 * 1024)).toFixed(2) + 'MB';
                    this.uploadedFiles.push({name:fileName, size:fileSize});
                    this.uploadedFiles = [];
                    this.showProgress = false;
                }
              }
            
            })
                                  
            this.message = response.data.message
          } catch (error) {
            console.error(error)
          }
        }
    }
  }
});
