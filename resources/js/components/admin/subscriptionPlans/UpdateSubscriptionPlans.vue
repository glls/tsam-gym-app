<template>

    <div>
        <div class="mb-3">
            <h1 class="h1 d-inline align-middle">Επεξεργασία Προγράμματος Συνδρομής</h1>
        </div>

        <div class="row">
            <div class="col-12 col-lg-6">
                <div class="card">
                    <div class="card-body">

                        <form v-on:submit.prevent="submitForm">
                            <div class="form-group">

                                <div class="mb-3">
                                    <label for="name">Όνομα</label>
                                    <input v-model="form.name" id="name" name="name" type="text" class="form-control" placeholder="Όνομα" required>
                                </div>

                                <div class="my-3">
                                    <label for="plan_price">Τιμή</label>
                                    <input v-model="form.plan_price" id="plan_price" name="plan_price" type="number" min="0" step="0.01" class="form-control" placeholder="Τιμή" required>
                                </div>

                                <div class="my-3">
                                    <label for="number_of_months">Μήνες</label>
                                    <input v-model="form.number_of_months" id="number_of_months" name="number_of_months" type="number" min="1" step="1" class="form-control" placeholder="Μήνες" required>
                                </div>

                                <div class="my-3">
                                    <label for="number_of_sessions">Αριθμός επισκέψεων</label>
                                    <input v-model="form.number_of_sessions" id="number_of_sessions" name="number_of_sessions" :disabled="this.form.unlimited_sessions === true" type="number" min="0" step="1" class="form-control" placeholder="Αριθμός επισκέψεων" :required="this.form.unlimited_sessions === false">
                                </div>

                                <div class="my-3">
                                    <label for="sessions_per_week">Αριθμός επισκέψεων ανά εβδομάδα</label>
                                    <input v-model="form.sessions_per_week" id="sessions_per_week" name="sessions_per_week" :disabled="this.form.unlimited_sessions === true" type="number" min="0" step="1" class="form-control" placeholder="Αριθμός επισκέψεων ανά εβδομάδα">
                                </div>

                                <div class="my-3">
                                    <label class="form-check">
                                        <input v-model="form.unlimited_sessions" @change="toggleUnlimitedSessionsCheckBox" id="unlimited_sessions" name="unlimited_sessions" class="form-check-input wave-check-input" type="checkbox">
                                        <span class="form-check-label">
                                              Απεριόριστες επισκέψεις
                                        </span>
                                    </label>
                                </div>

                                <div class="my-3">
                                    <label class="form-check">
                                        <input v-model="form.display_on_page" id="display_on_page" name="display_on_page" class="form-check-input wave-check-input" type="checkbox" value="true">
                                        <span class="form-check-label">
                                              Εμφάνιση στη σελίδα
                                        </span>
                                    </label>
                                </div>

                                <div class="mt-3">
                                    <input id="submit_subscription_plan" name="submit_subscription_plan" class="btn btn-primary button-color-wave" type="submit" value="Αποθήκευση">
                                </div>

                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
    export default {
        data() {
            return {
                form: {
                    name: null,
                    plan_price: null,
                    number_of_months: null,
                    number_of_sessions: null,
                    sessions_per_week: null,
                    unlimited_sessions: false,
                    display_on_page: false
                },
                id: this.$route.params.id,
            }
        },
        mounted() {
            axios.get('/admin/subscription-plans/' + this.id)
                .then(({data}) => {
                    //Perform Success Action
                    this.form.name = data.name;
                    this.form.plan_price = data.plan_price;
                    this.form.number_of_months = data.number_of_months;
                    this.form.number_of_sessions = data.number_of_sessions;
                    this.form.sessions_per_week = data.sessions_per_week;
                    this.form.unlimited_sessions = data.unlimited_sessions;
                    this.form.display_on_page = data.display_on_page;
                })
                .catch((error) => {
                    // display error message
                    this.$alertHandler.showAlert(error.response.data.message || error.message, error.response.status);
                }).finally(() => {
                //Perform action in always
            });
        },
        methods:{
            submitForm() {
                this.form.plan_price = parseFloat(this.form.plan_price);
                this.form.number_of_months = parseInt(this.form.number_of_months);
                this.form.number_of_sessions = this.form.number_of_sessions !== null ? parseInt(this.form.number_of_sessions) : null;
                this.form.sessions_per_week = this.form.sessions_per_week !== null ? parseInt(this.form.sessions_per_week) : null;

                axios.patch('/admin/subscription-plans/' + this.id, this.form)
                    .then((result) => {
                        //Perform Success Action
                        this.$router.push({ name: 'ShowSubscriptionPlans' });

                        // display success message
                        this.$alertHandler.showAlert('Subscription plan updated successfully', result.status);
                    })
                    .catch((error) => {
                        // display error message
                        this.$alertHandler.showAlert(error.response.data.message || error.message, error.response.status);
                    }).finally(() => {
                    //Perform action in always
                });
            },
            toggleUnlimitedSessionsCheckBox() {
                if (this.form.unlimited_sessions === true) {
                    this.form.number_of_sessions = null;
                    this.form.sessions_per_week = null;
                }
            },
        }
    }
</script>
