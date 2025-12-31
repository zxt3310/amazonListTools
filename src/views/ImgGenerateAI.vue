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
              <!-- 图片预览 -->
              <div v-if="generateForm.imageUrl" class="image-preview">
                <el-image
                  :src="generateForm.imageUrl"
                  fit="contain"
                  style="width: 300px; height: 200px;"
                  :preview-src-list="[generateForm.imageUrl]"
                >
                  <div slot="error" class="image-error">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
                <el-button
                  type="danger"
                  size="mini"
                  @click="clearImageUrl"
                  class="clear-button"
                >
                  清除
                </el-button>
              </div>
            </el-form-item>
            <el-form-item label="图片尺寸" label-position="left">
              <el-select
                v-model="generateForm.imageSize"
                placeholder="请选择图片尺寸"
                style="width: 100%;"
              >
                <el-option label="1K" value="1K"></el-option>
                <el-option label="2K" value="2K"></el-option>
                <el-option label="4K" value="4K"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="桌面风格" label-position="left">
              <el-select
                v-model="generateForm.desktopStyle"
                placeholder="请选择或输入桌面风格"
                filterable
                allow-create
                default-first-option
                style="width: 100%;"
                @change="generatePromptFromParams"
              >
                <el-option label="人文" value="人文"></el-option>
                <el-option label="运动" value="运动"></el-option>
                <el-option label="风景" value="风景"></el-option>
                <el-option label="自然" value="自然"></el-option>
                <el-option label="科技" value="科技"></el-option>
                <el-option label="商务" value="商务"></el-option>
                <el-option label="休闲" value="休闲"></el-option>
                <el-option label="科幻" value="科幻"></el-option>
                <el-option label="随机" value="随机"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="UPC码">
              <div class="upc-input-wrapper">
                <el-input
                  v-model="generateForm.upc"
                  placeholder="请输入UPC码"
                  style="width: 200px; margin-right: 10px;"
                ></el-input>
                <el-button
                  type="primary"
                  @click="queryUpc"
                  :loading="queryingUpc"
                  :disabled="generating"
                >
                  查询参数
                </el-button>
              </div>
            </el-form-item>

            <el-form-item label="可选放置元素">
              <div class="params-checkboxes">
                <!-- 处理器型号 -->
                <div
                  v-if="validProductParams.processor_model_number"
                  class="param-item"
                >
                  <el-checkbox
                    v-model="selectedParams.processor_model_number.selected"
                    @change="generatePromptFromParams"
                    :disabled="!selectedParams.processor_model_number.position"
                    title="请先选择位置"
                  >
                    处理器型号：{{ validProductParams.processor_model_number }}
                  </el-checkbox>
                  <el-select
                    v-model="selectedParams.processor_model_number.position"
                    placeholder="选择位置"
                    style="width: 150px; margin-left: 10px;"
                    @change="handlePositionChange('processor_model_number')"
                  >
                    <el-option
                      v-for="pos in availablePositions"
                      :key="pos.value"
                      :label="pos.label"
                      :value="pos.value"
                      :disabled="
                        usedPositions.includes(pos.value) &&
                          selectedParams.processor_model_number.position !==
                            pos.value
                      "
                    ></el-option>
                  </el-select>
                </div>

                <!-- 屏幕尺寸 -->
                <div v-if="validProductParams.display_size" class="param-item">
                  <el-checkbox
                    v-model="selectedParams.display_size.selected"
                    @change="generatePromptFromParams"
                    :disabled="!selectedParams.display_size.position"
                    title="请先选择位置"
                  >
                    屏幕尺寸：{{ validProductParams.display_size }}"
                  </el-checkbox>
                  <el-select
                    v-model="selectedParams.display_size.position"
                    placeholder="选择位置"
                    style="width: 150px; margin-left: 10px;"
                    @change="handlePositionChange('display_size')"
                  >
                    <el-option
                      v-for="pos in availablePositions"
                      :key="pos.value"
                      :label="pos.label"
                      :value="pos.value"
                      :disabled="
                        usedPositions.includes(pos.value) &&
                          selectedParams.display_size.position !== pos.value
                      "
                    ></el-option>
                  </el-select>
                </div>

                <!-- 分辨率 -->
                <div
                  v-if="validProductParams.native_resolution"
                  class="param-item"
                >
                  <el-checkbox
                    v-model="selectedParams.native_resolution.selected"
                    @change="generatePromptFromParams"
                    :disabled="!selectedParams.native_resolution.position"
                    title="请先选择位置"
                  >
                    分辨率：{{ validProductParams.native_resolution }}
                  </el-checkbox>
                  <el-select
                    v-model="selectedParams.native_resolution.position"
                    placeholder="选择位置"
                    style="width: 150px; margin-left: 10px;"
                    @change="handlePositionChange('native_resolution')"
                  >
                    <el-option
                      v-for="pos in availablePositions"
                      :key="pos.value"
                      :label="pos.label"
                      :value="pos.value"
                      :disabled="
                        usedPositions.includes(pos.value) &&
                          selectedParams.native_resolution.position !==
                            pos.value
                      "
                    ></el-option>
                  </el-select>
                </div>

                <!-- 触摸屏 -->
                <div
                  v-if="validProductParams.touchscreen !== undefined"
                  class="param-item"
                >
                  <el-checkbox
                    v-model="selectedParams.touchscreen.selected"
                    @change="generatePromptFromParams"
                    :disabled="!selectedParams.touchscreen.position"
                    title="请先选择位置"
                  >
                    触摸屏：{{
                      validProductParams.touchscreen ? "支持" : "不支持"
                    }}
                  </el-checkbox>
                  <el-select
                    v-model="selectedParams.touchscreen.position"
                    placeholder="选择位置"
                    style="width: 150px; margin-left: 10px;"
                    @change="handlePositionChange('touchscreen')"
                  >
                    <el-option
                      v-for="pos in availablePositions"
                      :key="pos.value"
                      :label="pos.label"
                      :value="pos.value"
                      :disabled="
                        usedPositions.includes(pos.value) &&
                          selectedParams.touchscreen.position !== pos.value
                      "
                    ></el-option>
                  </el-select>
                </div>

                <!-- WiFi -->
                <div v-if="validProductParams.wifi" class="param-item">
                  <el-checkbox
                    v-model="selectedParams.wifi.selected"
                    @change="generatePromptFromParams"
                    :disabled="!selectedParams.wifi.position"
                    title="请先选择位置"
                  >
                    WiFi：{{ validProductParams.wifi }}
                  </el-checkbox>
                  <el-select
                    v-model="selectedParams.wifi.position"
                    placeholder="选择位置"
                    style="width: 150px; margin-left: 10px;"
                    @change="handlePositionChange('wifi')"
                  >
                    <el-option
                      v-for="pos in availablePositions"
                      :key="pos.value"
                      :label="pos.label"
                      :value="pos.value"
                      :disabled="
                        usedPositions.includes(pos.value) &&
                          selectedParams.wifi.position !== pos.value
                      "
                    ></el-option>
                  </el-select>
                </div>

                <!-- 显卡 -->
                <div
                  v-if="validProductParams.graphics_coprocessor"
                  class="param-item"
                >
                  <el-checkbox
                    v-model="selectedParams.graphics_coprocessor.selected"
                    @change="generatePromptFromParams"
                    :disabled="!selectedParams.graphics_coprocessor.position"
                    title="请先选择位置"
                  >
                    显卡：{{ validProductParams.graphics_coprocessor }}
                  </el-checkbox>
                  <el-select
                    v-model="selectedParams.graphics_coprocessor.position"
                    placeholder="选择位置"
                    style="width: 150px; margin-left: 10px;"
                    @change="handlePositionChange('graphics_coprocessor')"
                  >
                    <el-option
                      v-for="pos in availablePositions"
                      :key="pos.value"
                      :label="pos.label"
                      :value="pos.value"
                      :disabled="
                        usedPositions.includes(pos.value) &&
                          selectedParams.graphics_coprocessor.position !==
                            pos.value
                      "
                    ></el-option>
                  </el-select>
                </div>
              </div>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click="generateImage"
                :loading="generating"
                :disabled="generating"
              >
                生成图片
              </el-button>
              <el-button @click="resetForm" :disabled="generating"
                >重置</el-button
              >
              <el-button
                v-if="generating"
                type="danger"
                @click="stopGeneration"
              >
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
          <el-progress
            :percentage="progressPercentage"
            :status="progressStatus"
          ></el-progress>
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
            <el-col
              :span="6"
              v-for="(image, index) in generatedImages"
              :key="index"
            >
              <div class="image-item">
                <el-image
                  :src="image.url"
                  fit="contain"
                  style="width: 100%; height: 200px;"
                  :preview-src-list="[image.url]"
                ></el-image>
                <div class="image-actions">
                  <el-button
                    size="mini"
                    type="primary"
                    @click="downloadImage(image.url, index)"
                  >
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
import MyNavi from "../components/Navi.vue";
import axios from "../js/request.js";

export default {
  name: "ImgGenerateAI",
  components: {
    MyNavi
  },
  data() {
    return {
      generateForm: {
        prompt: "",
        imageUrl: "",
        imageSize: "1K",
        upc: "",
        desktopStyle: "科技"
      },
      generating: false,
      generatedImages: [],
      progressPercentage: 0,
      progressStatus: "",
      progressMessage: "准备开始生成...",
      queryingUpc: false,
      productParams: {},
      // 可用的位置选项
      availablePositions: [
        { value: "top-left", label: "左上角" },
        { value: "top-right", label: "右上角" },
        { value: "bottom-left", label: "左下角" },
        { value: "bottom-right", label: "右下角" },
        { value: "left-center", label: "左中" },
        { value: "right-center", label: "右中" },
        { value: "center", label: "正中心" }
      ],
      // 参数选择和位置设置
      selectedParams: {
        processor_model_number: { selected: false, position: "" },
        display_size: { selected: false, position: "" },
        native_resolution: { selected: false, position: "" },
        touchscreen: { selected: false, position: "" },
        wifi: { selected: false, position: "" },
        graphics_coprocessor: { selected: false, position: "" }
      }
    };
  },

  computed: {
    // 过滤出有值的产品参数
    validProductParams() {
      const validParams = {};
      for (const key in this.productParams) {
        const value = this.productParams[key];
        // 跳过root_image字段，它已经作为参考图片使用
        if (key === "root_image") continue;
        // 检查值是否有效（非false、非null、非空字符串）
        if (value !== false && value != null && value !== "") {
          // 对WiFi参数进行特殊处理，只保留WiFi 5、WiFi 6、WiFi 6E、WiFi 7
          if (key === "wifi") {
            // 使用正则表达式提取WiFi核心标识
            // 调整分组顺序，确保6E优先匹配
            const wifiRegex = /(WiFi|wifi|Wi-Fi|wi-fi)\s+(6E|[567])/i;
            const match = value.match(wifiRegex);
            if (match) {
              // 提取并规范化WiFi标识，例如：WiFi 5, WiFi 6, WiFi 6E, WiFi 7
              validParams[key] = `WiFi ${match[2].toUpperCase()}`;
            }
          } else {
            validParams[key] = value;
          }
        }
      }
      return validParams;
    },

    // 检查参数位置是否有冲突
    conflictingPositions() {
      const usedPositions = {};
      const conflicts = [];

      for (const paramKey in this.selectedParams) {
        const param = this.selectedParams[paramKey];
        if (param.selected && param.position) {
          if (usedPositions[param.position]) {
            conflicts.push({
              param: paramKey,
              position: param.position,
              conflictingWith: usedPositions[param.position]
            });
          } else {
            usedPositions[param.position] = paramKey;
          }
        }
      }

      return conflicts;
    },

    // 获取已使用的位置
    usedPositions() {
      const positions = [];
      for (const paramKey in this.selectedParams) {
        const param = this.selectedParams[paramKey];
        if (param.selected && param.position) {
          positions.push(param.position);
        }
      }
      return positions;
    }
  },

  beforeDestroy() {
    // 组件销毁时停止生成
    this.generating = false;
  },
  methods: {
    // 生成图片
    async generateImage() {
      if (!this.generateForm.prompt.trim()) {
        this.$message.warning("请输入图片描述文本");
        return;
      }

      // 重置进度状态
      this.generating = true;
      this.progressPercentage = 0;
      this.progressStatus = "";
      this.progressMessage = "正在发送请求...";
      this.generatedImages = [];
      
      //先获取KEY
      let res = await axios.get("/getGrasaiApiKey")
      await this.sendGenerateRequest(res.data)
    },

    // 发送生成请求
    async sendGenerateRequest(key) {
      try {
        console.log("开始发送生成请求...");

        // 使用fetch发送POST请求启动生成任务并接收SSE流
        const response = await fetch(
          "https://grsai.dakka.com.cn/v1/draw/nano-banana",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${key}`
            },
            body: JSON.stringify({
              model: "nano-banana-pro",
              prompt: this.generateForm.prompt,
              urls: this.generateForm.imageUrl
                ? [this.generateForm.imageUrl]
                : [],
              imageSize: this.generateForm.imageSize,
              aspectRatio: "auto"
            })
          }
        );

        console.log("收到响应:", response);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // 检查响应是否有body
        if (!response.body) {
          throw new Error("响应体为空");
        }

        // 处理SSE流
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        try {
          let isReading = true;
          while (isReading) {
            const { done, value } = await reader.read();
            if (done) {
              console.log("SSE流读取完成");
              isReading = false;
              break;
            }
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");

            // 保留最后一行（可能不完整）
            buffer = lines.pop() || "";

            for (const line of lines) {
              if (line.trim() === "") continue;
              console.log("收到SSE消息:", line);
              try {
                // 处理SSE格式的消息
                if (line.startsWith("data: ")) {
                  const jsonStr = line.substring(6);
                  const data = JSON.parse(jsonStr);
                  this.handleSSEMessage(data);
                }
              } catch (error) {
                console.error("解析SSE消息失败:", error, line);
              }
            }
          }
        } finally {
          reader.releaseLock();
        }
      } catch (error) {
        console.error("发送生成请求失败:", error);
        this.generating = false;
        this.progressStatus = "exception";
        this.progressMessage = "发送请求失败";
        this.$message.error("发送请求失败");
      }
    },
    // 处理SSE消息
    handleSSEMessage(data) {
      if (data.status === "running") {
        this.progressPercentage = data.progress || 0;
        this.progressMessage = data.message || "正在生成图片...";
      } else if (data.status === "succeeded") {
        // 处理最终结果
        console.log("最终结果:", data);
        if (data.results) {
          this.generatedImages = data.results;
        }
        this.progressPercentage = 100;
        this.progressStatus = "success";
        this.progressMessage = "图片生成完成！";
        this.generating = false;
        this.$message.success("图片生成成功");
      } else if (data.status === "error") {
        this.progressStatus = "exception";
        this.progressMessage = data.message || "生成过程中发生错误";
        this.generating = false;
        this.$message.error(this.progressMessage);
      }
    },

    // 停止生成
    stopGeneration() {
      // 使用fetch API时，我们无法直接中断请求，但可以设置标志位
      this.generating = false;
      this.progressMessage = "已停止生成";
      this.$message.info("已停止图片生成");
    },

    // 清除图片URL
    clearImageUrl() {
      this.generateForm.imageUrl = "";
      this.$message.success("图片URL已清除");
    },

    resetForm() {
      if (this.generating) {
        this.stopGeneration();
      }

      this.generateForm = {
        prompt: "",
        imageUrl: "",
        imageSize: "1K",
        upc: "",
        desktopStyle: "科技"
      };
      this.generatedImages = [];
      this.progressPercentage = 0;
      this.progressStatus = "";
      this.progressMessage = "准备开始生成...";
      this.productParams = {};
      this.selectedParams = {
        processor_model_number: { selected: false, position: "" },
        display_size: { selected: false, position: "" },
        native_resolution: { selected: false, position: "" },
        touchscreen: { selected: false, position: "" },
        wifi: { selected: false, position: "" },
        graphics_coprocessor: { selected: false, position: "" }
      };
    },

    async downloadImage(url, index) {
      try {
        // 获取图片数据
        const response = await fetch(url);
        const blob = await response.blob();

        // 创建下载链接
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = `ai_generated_${Date.now()}_${index}.jpg`;

        // 触发下载
        document.body.appendChild(link);
        link.click();

        // 清理
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);

        this.$message.success("图片下载成功");
      } catch (error) {
        console.error("下载图片失败:", error);
        this.$message.error("下载图片失败");
      }
    },

    // 查询UPC参数
    async queryUpc() {
      if (!this.generateForm.upc.trim()) {
        this.$message.warning("请输入UPC码");
        return;
      }

      // 验证UPC格式（12位数字）
      const upcRegex = /^\d{12}$/;
      if (!upcRegex.test(this.generateForm.upc.trim())) {
        this.$message.error("请输入有效的12位UPC码");
        return;
      }

      this.queryingUpc = true;

      try {
        const upc = this.generateForm.upc.trim();
        const response = await axios.get(
          `https://dev.admin.amz.luyantech.com/api/upc/${upc}`
        );

        if (response.code === 0 && response.data) {
          this.productParams = response.data;

          // 自动设置参考图片URL
          if (response.data.root_image) {
            this.generateForm.imageUrl = response.data.root_image;
          }

          // 初始化参数位置（清空所有位置）
          for (const key in this.selectedParams) {
            this.selectedParams[key].position = "";
            // 默认不勾选任何参数
            this.selectedParams[key].selected = false;
          }

          // 自动生成描述文本
          this.generatePromptFromParams();

          this.$message.success("UPC参数查询成功");
        } else {
          this.$message.error("查询失败：" + (response.message || "未知错误"));
        }
      } catch (error) {
        console.error("UPC查询错误:", error);
        if (error.response) {
          // API返回错误
          this.$message.error(
            "查询失败，服务器返回错误：" + error.response.status
          );
        } else if (error.request) {
          // 请求发送成功但未收到响应
          this.$message.error("查询失败，服务器无响应，请检查网络连接");
        } else {
          // 请求设置错误
          this.$message.error("查询失败，请求错误：" + error.message);
        }
      } finally {
        this.queryingUpc = false;
      }
    },

    // 处理位置选择变化
    handlePositionChange(paramKey) {
      // 当选择位置后，自动勾选该参数
      if (this.selectedParams[paramKey].position) {
        this.selectedParams[paramKey].selected = true;
        this.generatePromptFromParams();
      }
    },

    // 根据产品参数生成描述文本
    generatePromptFromParams() {
      const { selectedParams, productParams } = this;

      // 位置名称映射
      const positionNames = {
        "top-left": "左上角",
        "top-right": "右上角",
        "bottom-left": "左下角",
        "bottom-right": "右下角",
        "left-center": "左中",
        "right-center": "右中",
        center: "正中央"
      };

      // 产品整体布局描述
      const layoutDescription =
        "将图中电脑放在纯白色的背景中，不要改变主体角度，";

      // 屏幕显示风格描述
      const screenStyle = `屏幕画面为${this.generateForm.desktopStyle}风格，元素可突破屏幕，强烈的视觉冲击力`;

      // 收集所有选中的参数及其位置信息
      const iconPlacements = [];

      // 处理器型号
      if (
        selectedParams.processor_model_number.selected &&
        productParams.processor_model_number
      ) {
        const pos = selectedParams.processor_model_number.position;
        const value = productParams.processor_model_number;
        if (pos) {
          iconPlacements.push({
            content: value,
            position: pos,
            label: "广告图标"
          });
        }
      }

      // 屏幕尺寸
      if (selectedParams.display_size.selected && productParams.display_size) {
        const pos = selectedParams.display_size.position;
        const value = `${productParams.display_size}"`;
        if (pos) {
          iconPlacements.push({
            content: value,
            position: pos,
            label: "广告图标"
          });
        }
      }

      // 分辨率
      if (
        selectedParams.native_resolution.selected &&
        productParams.native_resolution
      ) {
        const pos = selectedParams.native_resolution.position;
        const value = productParams.native_resolution;
        if (pos) {
          iconPlacements.push({
            content: value,
            position: pos,
            label: "广告图标"
          });
        }
      }

      // 触摸屏
      if (
        selectedParams.touchscreen.selected &&
        productParams.touchscreen !== undefined
      ) {
        const pos = selectedParams.touchscreen.position;
        const value = productParams.touchscreen ? "支持触摸屏" : "不支持触摸屏";
        if (pos) {
          iconPlacements.push({
            content: value,
            position: pos,
            label: "广告图标"
          });
        }
      }

      // WiFi
      if (selectedParams.wifi.selected && this.validProductParams.wifi) {
        const pos = selectedParams.wifi.position;
        const value = this.validProductParams.wifi;
        if (pos) {
          iconPlacements.push({
            content: value,
            position: pos,
            label: "广告图标"
          });
        }
      }

      // 显卡
      if (
        selectedParams.graphics_coprocessor.selected &&
        productParams.graphics_coprocessor
      ) {
        const pos = selectedParams.graphics_coprocessor.position;
        const value = productParams.graphics_coprocessor;
        if (pos) {
          iconPlacements.push({
            content: value,
            position: pos,
            label: "广告图标"
          });
        }
      }

      // 构建完整描述
      let prompt = `${layoutDescription}${screenStyle}`;

      // 添加图标放置描述
      if (iconPlacements.length > 0) {
        // 为每个位置添加元素描述
        iconPlacements.forEach((icon, index) => {
          const posName = positionNames[icon.position];
          if (index === 0) prompt += "，";
          if (index > 0) prompt += "，";
          prompt += `请在屏幕${posName}放置${icon.content}的${icon.label}`;
        });
      }

      this.generateForm.prompt = prompt;
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

.upc-input-wrapper {
  display: flex;
  align-items: center;
}

.params-checkboxes {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.param-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  padding: 5px 0;
  min-width: 300px;
}

.param-item .el-checkbox {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 图片预览样式 */
.image-preview {
  margin-top: 10px;
  position: relative;
  display: inline-block;
}

.image-error {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 300px;
  height: 200px;
  background-color: #f5f7fa;
  color: #909399;
  font-size: 30px;
}

.clear-button {
  margin-top: 5px;
  margin-left: 10px;
}
</style>
