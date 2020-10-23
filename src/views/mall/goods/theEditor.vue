<template>
    <div class="in-editor-panel">
        <quill-editor
            ref="quillEditor"
            v-model="content"
            :options="editorOption"
            @change="onChange"
        ></quill-editor>

        <div id="openUpdateImg" class="inline-block" @click="getNewData()"></div>
        <el-dialog title="提示" :visible.sync="isShowImage" width="30%" append-to-body>
            <div v-loading="sLoading">
                <el-tabs v-model="activeName">
                    <el-tab-pane label="图片库" name="first">
                        <div v-if="dataList.length>0">
                            <div
                                v-for="(item,i) in dataList"
                                :key="i"
                                :style="{'width':'33%'}"
                                class="inline-block border"
                                @click="handleClick(item.IMAGE)"
                            >
                                <img :src="item.IMAGE" alt class="block" />
                            </div>
                        </div>
                        <div v-else class="paddingTB-sm text-muted">暂无图片，请上传</div>
                    </el-tab-pane>
                    <el-tab-pane label="上传图片" name="second">
                        <input
                            type="file"
                            accept="image/png, image/gif, image/jpeg"
                            ref="newbanner"
                            id="quillUpdateImg"
                            v-on:change="inputChange()"
                            class="hide-"
                        />
                    </el-tab-pane>
                </el-tabs>
            </div>
            <!-- <div slot="footer" class="dialog-footer">
                <el-button @click="isShowImage = false">取 消</el-button>
                <el-button type="primary" @click="isShowImage = false">确 定</el-button>
            </div>-->
        </el-dialog>
    </div>
</template>

<script type="text/ecmascript-6">
import { mapState, mapGetters } from "vuex";
import Quill from "quill";
import { quillEditor } from "vue-quill-editor";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";

// 注意 修改wabpack配置 plugins
import { ImageDrop } from "quill-image-drop-module";
import ImageResize from "quill-image-resize-module";
Quill.register("modules/imageDrop", ImageDrop);
Quill.register("modules/imageResize", ImageResize);

import { getUserInfo } from "@/api/index";
import { ROOT_URL } from "@/util/define.js";
import dimg from "@/assets/default.png";
const toolbarArr = [
    [
        ["bold", "italic", "underline", "strike"],
        ["blockquote", "code-block"],
        [{ header: 1 }, { header: 2 }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ script: "sub" }, { script: "super" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ direction: "rtl" }],
        [{ size: ["small", false, "large", "huge"] }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ font: [] }],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
        ["clean"],
        ["link", "image"]
    ],
    [
        ["bold", "italic", "underline"],
        ["blockquote", "code-block"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
        ["link", "image", "video"]
    ],
    [
        ["bold", "italic", "underline"],
        ["blockquote", "code-block"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ color: [] }, { background: [] }],
        ["insert"]
    ]
];
const titleConfig = [
    { Choice: ".ql-bold", title: "加粗" },
    { Choice: ".ql-italic", title: "斜体" },
    { Choice: ".ql-underline", title: "下划线" },
    { Choice: ".ql-header", title: "段落格式" },
    { Choice: ".ql-strike", title: "删除线" },
    { Choice: ".ql-blockquote", title: "块引用" },
    { Choice: ".ql-code", title: "插入代码" },
    { Choice: ".ql-code-block", title: "插入代码段" },
    { Choice: ".ql-font", title: "字体" },
    { Choice: ".ql-size", title: "字体大小" },
    { Choice: '.ql-list[value="ordered"]', title: "编号列表" },
    { Choice: '.ql-list[value="bullet"]', title: "项目列表" },
    { Choice: ".ql-direction", title: "文本方向" },
    { Choice: '.ql-header[value="1"]', title: "h1" },
    { Choice: '.ql-header[value="2"]', title: "h2" },
    { Choice: ".ql-align", title: "对齐方式" },
    { Choice: ".ql-color", title: "字体颜色" },
    { Choice: ".ql-background", title: "背景颜色" },
    { Choice: ".ql-image", title: "图像" },
    { Choice: ".ql-video", title: "视频" },
    { Choice: ".ql-link", title: "添加链接" },
    { Choice: ".ql-formula", title: "插入公式" },
    { Choice: ".ql-clean", title: "清除字体格式" },
    { Choice: '.ql-script[value="sub"]', title: "下标" },
    { Choice: '.ql-script[value="super"]', title: "上标" },
    { Choice: '.ql-indent[value="-1"]', title: "向左缩进" },
    { Choice: '.ql-indent[value="+1"]', title: "向右缩进" },
    { Choice: ".ql-header .ql-picker-label", title: "标题大小" },
    { Choice: '.ql-header .ql-picker-item[data-value="1"]', title: "标题一" },
    { Choice: '.ql-header .ql-picker-item[data-value="2"]', title: "标题二" },
    { Choice: '.ql-header .ql-picker-item[data-value="3"]', title: "标题三" },
    { Choice: '.ql-header .ql-picker-item[data-value="4"]', title: "标题四" },
    { Choice: '.ql-header .ql-picker-item[data-value="5"]', title: "标题五" },
    { Choice: '.ql-header .ql-picker-item[data-value="6"]', title: "标题六" },
    { Choice: ".ql-header .ql-picker-item:last-child", title: "标准" },
    { Choice: '.ql-size .ql-picker-item[data-value="small"]', title: "小号" },
    { Choice: '.ql-size .ql-picker-item[data-value="large"]', title: "大号" },
    { Choice: '.ql-size .ql-picker-item[data-value="huge"]', title: "超大号" },
    { Choice: ".ql-size .ql-picker-item:nth-child(2)", title: "标准" },
    { Choice: ".ql-align .ql-picker-item:first-child", title: "居左对齐" },
    {
        Choice: '.ql-align .ql-picker-item[data-value="center"]',
        title: "居中对齐"
    },
    {
        Choice: '.ql-align .ql-picker-item[data-value="right"]',
        title: "居右对齐"
    },
    {
        Choice: '.ql-align .ql-picker-item[data-value="justify"]',
        title: "两端对齐"
    }
];
export default {
    props: {
        value: {
            type: String,
            default: ""
        },
        toolbarMode: {
            type: Number,
            default: 0
        },
        placeholder: {
            type: String,
            default: "请输入内容"
        },
        height: {
            type: Number,
            default: 170
        }
    },
    components: {
        quillEditor
    },
    data() {
        return {
            content: "",
            toolbars: toolbarArr,
            editorOption: {
                modules: {
                    toolbar: {
                        container: [],
                        handlers: {
                            image: function(value) {
                                if (value) {
                                    // document
                                    //     .querySelector("#quillUpdateImg")
                                    //     .click();
                                    document
                                        .querySelector("#openUpdateImg")
                                        .click();
                                } else {
                                    this.quill.format("image", false);
                                }
                            }
                        }
                    },
                    imageDrop: true,
                    imageResize: {
                        displayStyles: {
                            backgroundColor: "black",
                            border: "none",
                            color: "white"
                        },
                        modules: ["Resize", "DisplaySize", "Toolbar"]
                    }
                },
                placeholder: this.placeholder
            },
            isShowImage: false,
            activeName: "first",
            uploading: false,
            sLoading: false,
            filePathName: "shopimage",
            imgUrl: ROOT_URL + ":8080/resources/shopimage/",
            imgError: 'this.src="' + dimg + '"',
            pageData: {
                Image: "",
                SmallImage: ""
            }
        };
    },
    computed: {
        editor() {
            // console.log(this.$refs.quillEditor.quill);
            return this.$refs.quillEditor.quill;
        },
        ...mapGetters({
            dataListState: "imagesListState",
            dataList: "imagesList",
            uploadState: "goodsImgUploadState",
            dataState: "imagesState"
        })
    },
    watch: {
        // 监听父组件传入的内容
        value(newVal) {
            this.content = newVal;
            this.$nextTick(() => {
                this._listenerImage();
            });
        },
        content() {
            this._listenerImage();
        },
        dataListState(data) {
            if (data.success && this.sLoading) {
                this.isShowImage = true;
            }
            this.sLoading = false;
        },
        uploadState(data) {
            if (data.success && this.uploading) {
                this.handleClick(this.pageData.Image);
                this.$store.dispatch("saveImage", this.pageData);
            }
            this.uploading = false;
        },
        dataState(data) {
            if (data.success && data.type == "del") {
                this.getNewData();
            }
        }
    },
    created() {
        // 指定工具栏
        this.editorOption.modules.toolbar.container = this.toolbars[
            this.toolbarMode
        ];
    },
    mounted() {
        // 设置编辑器高度
        this.editor.container.style.height = `${this.height}px`;
        for (let item of titleConfig) {
            let tip = document.querySelector(".quill-editor " + item.Choice);
            if (!tip) continue;
            tip.setAttribute("title", item.title);
        }
    },
    methods: {
        // 显示宽度修改框
        _showWidthBox(event) {
            // 获取当前图片对象
            let currentImg = event.target;

            // 弹出宽度输入框
            this.$prompt("请输入宽度", "提示", {
                inputValue: currentImg.width,
                confirmButtonText: "确定",
                cancelButtonText: "取消"
            })
                .then(({ value }) => {
                    // 赋值新宽度
                    currentImg.width = value;
                })
                .catch(() => {});
        },

        inputChange() {
            var imgFile = this.$refs["newbanner"].files[0];
            var userInfo = getUserInfo();
            let name =
                userInfo.CompanyID +
                "_" +
                (parseInt(this.dataListState.data.ImageMaxNum) + 1) +
                ".png";
            let _this = this;

            if (imgFile) {
                var fr = new FileReader();
                fr.onload = function() {
                    // fr.result; // base64
                    _this.$store
                        .dispatch("uploadGoodsImg", {
                            name: name,
                            filePath: _this.filePathName,
                            file: fr.result
                        })
                        .then(() => {
                            _this.pageData.Image = _this.imgUrl + name;
                            _this.uploading = true;
                            _this.$refs["newbanner"].value = "";
                        });
                };
                fr.readAsDataURL(imgFile);
            }
        },

        // 监听图片点击
        _listenerImage() {
            console.log("监听图片点击");
            // 获取DOM对象
            let editor = document.getElementsByClassName("ql-editor")[0];
            let img = editor.getElementsByTagName("img");

            // 非空验证
            if (img.length === 0) {
                return;
            }

            for (let i = 0; i < img.length; i++) {
                let currentImg = img[i];

                // 绑定且防止重复绑定
                currentImg.removeEventListener(
                    "dblclick",
                    this._showWidthBox,
                    false
                );
                currentImg.addEventListener(
                    "dblclick",
                    this._showWidthBox,
                    false
                );
            }
        },

        getNewData() {
            this.$store.dispatch("getImagesList").then(() => {
                this.sLoading = true;
            });
        },
        handleClick(url) {
            let quill = this.$refs["quillEditor"].quill;
            let length = quill.getSelection() ? quill.getSelection().index : 0;
            quill.insertEmbed(length, "image", url); // 插入图片 url路径 或 base64
            quill.setSelection(length + 1); // 调整光标到最后

            console.log(quill.selection.savedRange.index + "====>" + length);

            this.isShowImage = false;
        },
        onChange(e) {
            // 告知父组件内容发生变化
            // console.log(this.content);
            this.$emit("input", e);
        }
    }
};
</script>

