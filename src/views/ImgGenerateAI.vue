<template>
  <div class="container">
    <MyNavi activeIndex="16"></MyNavi>
    <div class="main-content">
      <h2>AI图片生成</h2>
      
      <!-- 输入区域 -->
      <div class="input-section">
        <el-card class="input-card">
          <div slot="header" class="clearfix">
            <span>图片生成参数</span>
          </div>
          <el-form :model="generateForm" label-width="120px">
            <el-form-item label="描述文本">
              <el-input
                v-model="generateForm.prompt"
                type="textarea"
                :rows="4"
                placeholder="请输入图片描述文本..."
              ></el-input>
            </el-form-item>
            <el-form-item label="参考图片URL">
              <el-input
                v-model="generateForm.imageUrl"
                placeholder="请输入参考图片URL（可选）"
              ></el-input>
            </el-form-item>
            <el-form-item label="图片尺寸">
              <el-select v-model="generateForm.imageSize" placeholder="请选择图片尺寸">
                <el-option label="1K" value="1K"></el-option>
                <el-option label="2K" value="2K"></el-option>
                <el-option label="4K" value="4K"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="generateImage" :loading="generating" :disabled="generating">
                生成图片
              </el-button>
              <el-button @click="resetForm" :disabled="generating">重置</el-button>
              <el-button v-if="generating" type="danger" @click="stopGeneration">
                停止生成
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
      
      <!-- 进度显示区域 -->
      <div class="progress-section" v-if="generating">
        <el-card class="progress-card">
          <div slot="header" class="clearfix">
            <span>生成进度</span>
          </div>
          <el-progress :percentage="progressPercentage" :status="progressStatus"></el-progress>
          <div class="progress-message">{{ progressMessage }}</div>
        </el-card>
      </div>
      
      <!-- 生成结果区域 -->
      <div class="result-section" v-if="generatedImages.length > 0">
        <el-card class="result-card">
          <div slot="header" class="clearfix">
            <span>生成结果</span>
          </div>
          <el-row :gutter="20">
            <el-col :span="6" v-for="(image, index) in generatedImages" :key="index">
              <div class="image-item">
                <el-image
                  :src="image.url"
                  fit="contain"
                  style="width: 100%; height: 200px;"
                  :preview-src-list="[image.url]"
                ></el-image>
                <div class="image-actions">
                  <el-button size="mini" type="primary" @click="downloadImage(image.url, index)">
                    下载
                  </el-button>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import MyNavi from '../components/Navi.vue';
import axios from '../js/request.js';

export default {
  name: 'ImgGenerateAI',
  components: {
    MyNavi
  },
  data() {
    return {
      generateForm: {
        prompt: '',
        imageUrl: '',
        imageSize: '1K'
      },
      generating: false,
      generatedImages: [],
      progressPercentage: 0,
      progressStatus: '',
      progressMessage: '准备开始生成...'
    };
  },
  
  beforeDestroy() {
    // 组件销毁时停止生成
    this.generating = false;
  },
  methods: {
    // 生成图片
    async generateImage() {
      if (!this.generateForm.prompt.trim()) {
        this.$message.warning('请输入图片描述文本');
        return;
      }
      
      // 重置进度状态
      this.generating = true;
      this.progressPercentage = 0;
      this.progressStatus = '';
      this.progressMessage = '正在发送请求...';
      this.generatedImages = [];
      
      // 发送生成请求
      await this.sendGenerateRequest();
    },
    
    // 发送生成请求
    async sendGenerateRequest() {
      try {
        console.log('开始发送生成请求...');
        
        // 使用fetch发送POST请求启动生成任务并接收SSE流
        const response = await fetch('https://grsai.dakka.com.cn/v1/draw/nano-banana', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer sk-90159500be454a8a854e2c4355f7d7b2`
          },
          body: JSON.stringify({
            model: 'nano-banana-pro',
            prompt: this.generateForm.prompt,
            urls: this.generateForm.imageUrl ? [this.generateForm.imageUrl] : [],
            imageSize: this.generateForm.imageSize,
            aspectRatio: "auto",
          })
        });
        
        console.log('收到响应:', response);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // 检查响应是否有body
        if (!response.body) {
          throw new Error('响应体为空');
        }
        
        // 处理SSE流
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        
        try {
           let isReading = true;
           while (isReading) {
             const { done, value } = await reader.read();
             if (done) {
               console.log('SSE流读取完成');
               isReading = false;
               break;
             }
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');     
                 
            // 保留最后一行（可能不完整）
            buffer = lines.pop() || '';
            
            for (const line of lines) { 
              if (line.trim() === '') continue;
              console.log('收到SSE消息:', line);
              try {
                // 处理SSE格式的消息
                if (line.startsWith('data: ')) {
                  const jsonStr = line.substring(6);
                  const data = JSON.parse(jsonStr);
                  this.handleSSEMessage(data);
                }
              } catch (error) {
                console.error('解析SSE消息失败:', error, line);
              }
            }
          }
        } finally {
          reader.releaseLock();
        }
      } catch (error) {
        console.error('发送生成请求失败:', error);
        this.generating = false;
        this.progressStatus = 'exception';
        this.progressMessage = '发送请求失败';
        this.$message.error('发送请求失败');
      }
    },    
    // 处理SSE消息
    handleSSEMessage(data) {
      if (data.status === 'running') {
        this.progressPercentage = data.progress || 0;
        this.progressMessage = data.message || '正在生成图片...';
      } else if (data.status === 'succeeded') {
        // 处理最终结果
        console.log('最终结果:', data);
        if (data.results) {
          this.generatedImages = data.results;
        }
        this.progressPercentage = 100;
        this.progressStatus = 'success';
        this.progressMessage = '图片生成完成！';
        this.generating = false;
        this.$message.success('图片生成成功');
      } else if (data.status === 'error') {
        this.progressStatus = 'exception';
        this.progressMessage = data.message || '生成过程中发生错误';
        this.generating = false;
        this.$message.error(this.progressMessage);
      }
    },
    
    // 停止生成
    stopGeneration() {
      // 使用fetch API时，我们无法直接中断请求，但可以设置标志位
      this.generating = false;
      this.progressMessage = '已停止生成';
      this.$message.info('已停止图片生成');
    },
    
    resetForm() {
      if (this.generating) {
        this.stopGeneration();
      }
      
      this.generateForm = {
        prompt: '',
        imageUrl: '',
        imageSize: '1K'
      };
      this.generatedImages = [];
      this.progressPercentage = 0;
      this.progressStatus = '';
      this.progressMessage = '准备开始生成...';
    },
    
    async downloadImage(url, index) {
      try {
        // 获取图片数据
        const response = await fetch(url);
        const blob = await response.blob();
        
        // 创建下载链接
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `ai_generated_${Date.now()}_${index}.jpg`;
        
        // 触发下载
        document.body.appendChild(link);
        link.click();
        
        // 清理
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
        
        this.$message.success('图片下载成功');
      } catch (error) {
        console.error('下载图片失败:', error);
        this.$message.error('下载图片失败');
      }
    }
  }
};
</script>

<style scoped>
.container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 20px;
  background-color: #f5f7fa;
  overflow: auto;
}

h2 {
  color: #303133;
  margin-bottom: 20px;
  text-align: center;
}

.input-section {
  margin-bottom: 20px;
}

.input-card {
  margin-bottom: 20px;
}

.progress-section {
  margin-bottom: 20px;
}

.progress-card {
  margin-bottom: 20px;
}

.progress-message {
  margin-top: 10px;
  text-align: center;
  color: #606266;
}

.result-section {
  margin-top: 20px;
}

.image-item {
  margin-bottom: 15px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 10px;
  transition: box-shadow 0.3s;
}

.image-item:hover {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.image-actions {
  margin-top: 10px;
  text-align: center;
}
</style>