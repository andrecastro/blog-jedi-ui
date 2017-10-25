Vue.component('ckeditor', {
        name: 'vue-ckeditor',
        template: '<div class="ckeditor"><textarea :name="name" :id="id" :value="value" :types="types":config="config"> </textarea> </div>',
        props: {
            name: {
                type: String,
                default: () => `editor`
        },
        value: {
            type: String
        },
        id: {
            type: String,
            default: () => `editor`
    },
    types: {
    type: String,
default: () => `classic`
},
config: {
    type: Object,
default: () => {}
}
},
data () {
    return { destroyed: false }
},
computed: {
    instance () {
        return CKEDITOR.instances[this.id]
    }
},
watch: {
    value (val) {
        if (this.instance) {
            this.update(val)
        }
    }
},
mounted () {
    this.create()
},
beforeDestroy () {
    this.destroy()
},
methods: {
    create () {
        var component = this;
        if (typeof CKEDITOR === 'undefined') {
            console.log('CKEDITOR is missing (http://ckeditor.com/)')
        } else {
            if (component.types === 'inline') {
                CKEDITOR.inline(component.id, component.config)
            } else {
                CKEDITOR.replace(component.id, component.config)
            }

            component.instance.setData(component.value)
            component.instance.on('change', component.onChange)
            component.instance.on('blur', component.onBlur)
            component.instance.on('focus', component.onFocus)
        }
    },
    update (val) {
        let html = this.instance.getData()
        if (html !== val) {
            this.instance.setData(val)
        }
    },
    destroy () {
        if (!this.destroyed) {
            this.instance.focusManager.blur(true)
            this.instance.removeAllListeners()
            this.instance.destroy()
            this.destroyed = true
        }
    },
    onChange () {
        let html = this.instance.getData()
        if (html !== this.value) {
            this.$emit('input', html)
        }
    },
    onBlur () {
        this.$emit('blur', this.instance)
    },
    onFocus () {
        this.$emit('focus', this.instance)
    }
}
})