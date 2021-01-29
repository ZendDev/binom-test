<template>
    <div class="main">
        <header class="header">
            <h1>Пользователи</h1>
            <button @click="addModal = true">Добавить пользователя</button>
        </header>
        <hr>
        <div class="content">
            <div class="user" v-for="users in $store.state.users.userData" :key="users.id">
                <div class="user__name">{{ users.name }}</div>
                <div class="user__control">
                    <button @click="editUser(users.id)">Редактировать</button>
                    <button @click="removeUser(users.id)">Удалить</button>
                </div>
            </div>
            <Modal v-model="addModal" title="Добавление пользователя">
                <div class="user-row">
                    <div class="user-row">
                        <div v-for="(fields, index) in userFields" :key="index">
                            <div class="field-row" v-if="fields.type === 'string'">
                                <label>Имя</label>
                                <input 
                                    type="text"
                                    v-model="addedUser.name" 
                                    placeholder="Имя пользователя"
                                    @input="getUserField('field', fields.field, 'validator')($event, fields.field)"
                                />

                                {{ errors[fields.field] }}
                            </div>
                            <div class="field-row" v-else-if="fields.type === 'select'">
                                <label>Пол</label>
                                <select 
                                    v-model="addedUser.gender"
                                    @input="getUserField('field', fields.field, 'validator')($event, fields.field)"
                                >
                                    <option value="false">None</option>
                                    <option 
                                        v-for="(option, key) in fields.meta.values" 
                                        :key="key" 
                                        :value="option.value"
                                        >
                                        {{option.label}}
                                    </option>
                                </select>

                                {{ errors[fields.field] }}
                            </div>
                            <div class="field-row" v-else-if="fields.type === 'date'">
                                <label>Дата</label>
                                <datepicker @input="getUserField('field', fields.field, 'validator')($event, fields.field)" v-model="addedUser.sub"></datepicker>

                                {{ errors[fields.field] }}
                            </div>
                        </div>
                    </div>
                    <button @click="addUser">Добавить</button>                   
                </div>
            </Modal>
            <Modal v-model="editModal" title="Редактирование пользователя">
                <div v-if="loadedUser" class="user-row">
                    <div v-for="field in Object.keys(loadedUser)" :key="field">
                        <div class="field-row" v-if="getUserField('field', field, 'type') === 'string'">
                            <label>Имя</label>
                            <input type="text" v-model="loadedUser[field]"  />
                        </div>
                        <div class="field-row" v-else-if="getUserField('field', field, 'type') === 'select'">
                            <label>Пол</label>
                            <select v-model="loadedUser[field]">
                                <option value="false">None</option>
                                <option 
                                    v-for="(option, key) in getUserField('type', 'select', 'meta').values" 
                                    :key="key" 
                                    :value="option.value"
                                    :selected="loadedUser[field] === option.value"
                                    >
                                    {{option.label}}
                                </option>
                            </select>
                           
                        </div>
                        <div class="field-row" v-else-if="getUserField('field', field, 'type') === 'date'">
                            <label>Дата</label>
                            <datepicker v-model="loadedUser[field]"></datepicker>
                           
                        </div>
                    </div>
                </div>
                <button @click="updateUser">Изменить</button>    
            </Modal>
        </div>
    </div>
</template>

<script>
import VueModal from '@kouts/vue-modal';
import Datepicker from 'vuejs-datepicker';
import '@kouts/vue-modal/dist/vue-modal.css';

const initUserState = {
    name: '',
    gender: '',
    sub: ''
}

export default {
    data() {
        return {
            errors: {},
            loadedUser: {},
            addedUser: {...initUserState},
            editModal: false,
            addModal: false,
            userFields: [
                {
                    label: "Name",
                    field: "name",
                    type: "string",
                    validator: this.nameValidator
                },
                {
                    label: "Gender",
                    field: "gender",
                    type: "select",
                    validator: this.genderValidator,
                    meta: {
                        "values": [
                            {
                                "label": "Male",
                                "value": "male"
                            },
                            {
                                "label": "Female",
                                "value": "femele"
                            }
                        ]
                    }
                },
                {
                    label: "Subscription",
                    field: "sub",
                    type: "date",
                    validator: this.dateValidator
                }
            ]
        }
    },
    components:{
        'Modal': VueModal,
        Datepicker
    },
    methods: {
        getUserField(by, search, resp) {
            const index = this.userFields.findIndex(user => user[by] === search)

            if(!this.userFields[index]) return

            return this.userFields[index][resp]
        },
        addUser() {
            if (this.validateForm(this.addedUser)) return false

            this.$store.dispatch('users/add', this.addedUser)

            this.addedUser = initUserState

            this.addModal = false
        },
        editUser(id){
            this.loadedUser = {...this.$store.getters['users/getById'](id)}
            this.errors = {}
            this.editModal = true
        },
        updateUser() {

            const index = this.$store.state.users.userData.findIndex(user => user.id === this.loadedUser.id)

            this.$store.dispatch('users/update', {index, data: this.loadedUser});

            this.loadedUser = {}
            this.editModal = false
        },
        removeUser(id){
            this.$store.dispatch('users/remove', id);
        },

        validateForm(data) {
            let checkError = false

            for (let field in data) {
                const validator = this.getUserField('field', field, 'validator')

                if ({}.toString.call(validator) === '[object Function]') {
                    validator(this.addedUser[field], field)
                    if(this.errors[field]) {
                        checkError = true
                    }
                }
            }

            return checkError
        },
        nameValidator(event, field) {
            const value = event.target ? event.target.value : event

            this.checkLength(value, field, 3, 16)
        },
        genderValidator(event, field){
            const value = event.target ? event.target.value : event

            this.valueExists(value, field)
        },
        dateValidator(event, field){
            const value = event.target ? event.target.value : event

            this.valueExists(value, field)
        },

        valueExists(value, field) {
            if (!value) {
                this.$set(this.errors, field, "Обязательное поле для заполнения")
            } else {
                delete this.errors[field]
            }
        },
        checkLength(value, field, min, max) {
            if (value.length <= min) {
                this.$set(this.errors, field, `Минимальное количество символов ${min}`)
            } else if (value.length > max) {
                this.$set(this.errors, field, `Максимальное количество символов ${max}`)
            } else {
                delete this.errors[field]
            }
        }
    }

}
</script>

<style lang="scss">
    .header{
        height:60px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-direction: row;
        margin-top:20px;
        margin-bottom:20px;
        h1{
            font-size: 28px;
            font-weight: bold;
            color: #4747b5;
        }
        button{
            background: #ccc;
            color: #4747b5;
            border: none;
            border-radius: 5px;
            padding: 10px 20px;
            font-weight: 600;            
        }
    }
    .user-row {
        display: flex;
    }
    .user{
        display: flex;
        align-items: center;
        justify-content: space-between;
        height:40px;
        border: 1px solid #4747b5;
        border-radius: 5px;
        padding: 3px 10px;
        margin-bottom:15px;
        &__name{
            font-size:16px;
            color:#434343;
        }
        &__control{
            button{
                margin: 0 10px;
                font-size: 16px;
                background: #4747b5;
                color:#FFF;
                border:none;
                border-radius: 5px;
                padding: 5px 10px;
            }
        }
    }
    .user-row{
        display: flex;
        flex-direction: column;
    }
    .field-row{
        display: block;
        width:100%;
        margin-bottom:20px;
        input{
            width:-webkit-fill-available;
            display: block;
        }
        select{
            display: block;
            width:100%;
        }
    }
</style>