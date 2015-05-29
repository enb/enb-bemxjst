block('b-data').match(this.data && this.data.title)(
    content()(function () {
        return this.data.title;
    })
)
