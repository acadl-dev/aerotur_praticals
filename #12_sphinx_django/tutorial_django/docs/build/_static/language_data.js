/*
 * This script contains the language-specific data used by searchtools.js,
 * namely the list of stopwords, stemmer, scorer and splitter.
 */

var stopwords = ["a", "ao", "aos", "aquela", "aquelas", "aquele", "aqueles", "aquilo", "as", "at\u00e9", "com", "como", "da", "das", "de", "dela", "delas", "dele", "deles", "depois", "do", "dos", "e", "ela", "elas", "ele", "eles", "em", "entre", "era", "eram", "essa", "essas", "esse", "esses", "esta", "estamos", "estas", "estava", "estavam", "este", "esteja", "estejam", "estejamos", "estes", "esteve", "estive", "estivemos", "estiver", "estivera", "estiveram", "estiverem", "estivermos", "estivesse", "estivessem", "estiv\u00e9ramos", "estiv\u00e9ssemos", "estou", "est\u00e1", "est\u00e1vamos", "est\u00e3o", "eu", "foi", "fomos", "for", "fora", "foram", "forem", "formos", "fosse", "fossem", "fui", "f\u00f4ramos", "f\u00f4ssemos", "haja", "hajam", "hajamos", "havemos", "hei", "houve", "houvemos", "houver", "houvera", "houveram", "houverei", "houverem", "houveremos", "houveria", "houveriam", "houvermos", "houver\u00e1", "houver\u00e3o", "houver\u00edamos", "houvesse", "houvessem", "houv\u00e9ramos", "houv\u00e9ssemos", "h\u00e1", "h\u00e3o", "isso", "isto", "j\u00e1", "lhe", "lhes", "mais", "mas", "me", "mesmo", "meu", "meus", "minha", "minhas", "muito", "na", "nas", "nem", "no", "nos", "nossa", "nossas", "nosso", "nossos", "num", "numa", "n\u00e3o", "n\u00f3s", "o", "os", "ou", "para", "pela", "pelas", "pelo", "pelos", "por", "qual", "quando", "que", "quem", "se", "seja", "sejam", "sejamos", "sem", "serei", "seremos", "seria", "seriam", "ser\u00e1", "ser\u00e3o", "ser\u00edamos", "seu", "seus", "somos", "sou", "sua", "suas", "s\u00e3o", "s\u00f3", "tamb\u00e9m", "te", "tem", "temos", "tenha", "tenham", "tenhamos", "tenho", "terei", "teremos", "teria", "teriam", "ter\u00e1", "ter\u00e3o", "ter\u00edamos", "teu", "teus", "teve", "tinha", "tinham", "tive", "tivemos", "tiver", "tivera", "tiveram", "tiverem", "tivermos", "tivesse", "tivessem", "tiv\u00e9ramos", "tiv\u00e9ssemos", "tu", "tua", "tuas", "t\u00e9m", "t\u00ednhamos", "um", "uma", "voc\u00ea", "voc\u00eas", "vos", "\u00e0", "\u00e0s", "\u00e9ramos"];


/* Non-minified version is copied as a separate JS file, if available */
/**@constructor*/
BaseStemmer = function() {
    this.setCurrent = function(value) {
        this.current = value;
        this.cursor = 0;
        this.limit = this.current.length;
        this.limit_backward = 0;
        this.bra = this.cursor;
        this.ket = this.limit;
    };

    this.getCurrent = function() {
        return this.current;
    };

    this.copy_from = function(other) {
        this.current          = other.current;
        this.cursor           = other.cursor;
        this.limit            = other.limit;
        this.limit_backward   = other.limit_backward;
        this.bra              = other.bra;
        this.ket              = other.ket;
    };

    this.in_grouping = function(s, min, max) {
        if (this.cursor >= this.limit) return false;
        var ch = this.current.charCodeAt(this.cursor);
        if (ch > max || ch < min) return false;
        ch -= min;
        if ((s[ch >>> 3] & (0x1 << (ch & 0x7))) == 0) return false;
        this.cursor++;
        return true;
    };

    this.in_grouping_b = function(s, min, max) {
        if (this.cursor <= this.limit_backward) return false;
        var ch = this.current.charCodeAt(this.cursor - 1);
        if (ch > max || ch < min) return false;
        ch -= min;
        if ((s[ch >>> 3] & (0x1 << (ch & 0x7))) == 0) return false;
        this.cursor--;
        return true;
    };

    this.out_grouping = function(s, min, max) {
        if (this.cursor >= this.limit) return false;
        var ch = this.current.charCodeAt(this.cursor);
        if (ch > max || ch < min) {
            this.cursor++;
            return true;
        }
        ch -= min;
        if ((s[ch >>> 3] & (0X1 << (ch & 0x7))) == 0) {
            this.cursor++;
            return true;
        }
        return false;
    };

    this.out_grouping_b = function(s, min, max) {
        if (this.cursor <= this.limit_backward) return false;
        var ch = this.current.charCodeAt(this.cursor - 1);
        if (ch > max || ch < min) {
            this.cursor--;
            return true;
        }
        ch -= min;
        if ((s[ch >>> 3] & (0x1 << (ch & 0x7))) == 0) {
            this.cursor--;
            return true;
        }
        return false;
    };

    this.eq_s = function(s)
    {
        if (this.limit - this.cursor < s.length) return false;
        if (this.current.slice(this.cursor, this.cursor + s.length) != s)
        {
            return false;
        }
        this.cursor += s.length;
        return true;
    };

    this.eq_s_b = function(s)
    {
        if (this.cursor - this.limit_backward < s.length) return false;
        if (this.current.slice(this.cursor - s.length, this.cursor) != s)
        {
            return false;
        }
        this.cursor -= s.length;
        return true;
    };

    /** @return {number} */ this.find_among = function(v)
    {
        var i = 0;
        var j = v.length;

        var c = this.cursor;
        var l = this.limit;

        var common_i = 0;
        var common_j = 0;

        var first_key_inspected = false;

        while (true)
        {
            var k = i + ((j - i) >>> 1);
            var diff = 0;
            var common = common_i < common_j ? common_i : common_j; // smaller
            // w[0]: string, w[1]: substring_i, w[2]: result, w[3]: function (optional)
            var w = v[k];
            var i2;
            for (i2 = common; i2 < w[0].length; i2++)
            {
                if (c + common == l)
                {
                    diff = -1;
                    break;
                }
                diff = this.current.charCodeAt(c + common) - w[0].charCodeAt(i2);
                if (diff != 0) break;
                common++;
            }
            if (diff < 0)
            {
                j = k;
                common_j = common;
            }
            else
            {
                i = k;
                common_i = common;
            }
            if (j - i <= 1)
            {
                if (i > 0) break; // v->s has been inspected
                if (j == i) break; // only one item in v

                // - but now we need to go round once more to get
                // v->s inspected. This looks messy, but is actually
                // the optimal approach.

                if (first_key_inspected) break;
                first_key_inspected = true;
            }
        }
        do {
            var w = v[i];
            if (common_i >= w[0].length)
            {
                this.cursor = c + w[0].length;
                if (w.length < 4) return w[2];
                var res = w[3](this);
                this.cursor = c + w[0].length;
                if (res) return w[2];
            }
            i = w[1];
        } while (i >= 0);
        return 0;
    };

    // find_among_b is for backwards processing. Same comments apply
    this.find_among_b = function(v)
    {
        var i = 0;
        var j = v.length

        var c = this.cursor;
        var lb = this.limit_backward;

        var common_i = 0;
        var common_j = 0;

        var first_key_inspected = false;

        while (true)
        {
            var k = i + ((j - i) >> 1);
            var diff = 0;
            var common = common_i < common_j ? common_i : common_j;
            var w = v[k];
            var i2;
            for (i2 = w[0].length - 1 - common; i2 >= 0; i2--)
            {
                if (c - common == lb)
                {
                    diff = -1;
                    break;
                }
                diff = this.current.charCodeAt(c - 1 - common) - w[0].charCodeAt(i2);
                if (diff != 0) break;
                common++;
            }
            if (diff < 0)
            {
                j = k;
                common_j = common;
            }
            else
            {
                i = k;
                common_i = common;
            }
            if (j - i <= 1)
            {
                if (i > 0) break;
                if (j == i) break;
                if (first_key_inspected) break;
                first_key_inspected = true;
            }
        }
        do {
            var w = v[i];
            if (common_i >= w[0].length)
            {
                this.cursor = c - w[0].length;
                if (w.length < 4) return w[2];
                var res = w[3](this);
                this.cursor = c - w[0].length;
                if (res) return w[2];
            }
            i = w[1];
        } while (i >= 0);
        return 0;
    };

    /* to replace chars between c_bra and c_ket in this.current by the
     * chars in s.
     */
    this.replace_s = function(c_bra, c_ket, s)
    {
        var adjustment = s.length - (c_ket - c_bra);
        this.current = this.current.slice(0, c_bra) + s + this.current.slice(c_ket);
        this.limit += adjustment;
        if (this.cursor >= c_ket) this.cursor += adjustment;
        else if (this.cursor > c_bra) this.cursor = c_bra;
        return adjustment;
    };

    this.slice_check = function()
    {
        if (this.bra < 0 ||
            this.bra > this.ket ||
            this.ket > this.limit ||
            this.limit > this.current.length)
        {
            return false;
        }
        return true;
    };

    this.slice_from = function(s)
    {
        var result = false;
        if (this.slice_check())
        {
            this.replace_s(this.bra, this.ket, s);
            result = true;
        }
        return result;
    };

    this.slice_del = function()
    {
        return this.slice_from("");
    };

    this.insert = function(c_bra, c_ket, s)
    {
        var adjustment = this.replace_s(c_bra, c_ket, s);
        if (c_bra <= this.bra) this.bra += adjustment;
        if (c_bra <= this.ket) this.ket += adjustment;
    };

    this.slice_to = function()
    {
        var result = '';
        if (this.slice_check())
        {
            result = this.current.slice(this.bra, this.ket);
        }
        return result;
    };

    this.assign_to = function()
    {
        return this.current.slice(0, this.limit);
    };
};

// Generated by Snowball 2.1.0 - https://snowballstem.org/

/**@constructor*/
PortugueseStemmer = function() {
    var base = new BaseStemmer();
    /** @const */ var a_0 = [
        ["", -1, 3],
        ["\u00E3", 0, 1],
        ["\u00F5", 0, 2]
    ];

    /** @const */ var a_1 = [
        ["", -1, 3],
        ["a~", 0, 1],
        ["o~", 0, 2]
    ];

    /** @const */ var a_2 = [
        ["ic", -1, -1],
        ["ad", -1, -1],
        ["os", -1, -1],
        ["iv", -1, 1]
    ];

    /** @const */ var a_3 = [
        ["ante", -1, 1],
        ["avel", -1, 1],
        ["\u00EDvel", -1, 1]
    ];

    /** @const */ var a_4 = [
        ["ic", -1, 1],
        ["abil", -1, 1],
        ["iv", -1, 1]
    ];

    /** @const */ var a_5 = [
        ["ica", -1, 1],
        ["\u00E2ncia", -1, 1],
        ["\u00EAncia", -1, 4],
        ["logia", -1, 2],
        ["ira", -1, 9],
        ["adora", -1, 1],
        ["osa", -1, 1],
        ["ista", -1, 1],
        ["iva", -1, 8],
        ["eza", -1, 1],
        ["idade", -1, 7],
        ["ante", -1, 1],
        ["mente", -1, 6],
        ["amente", 12, 5],
        ["\u00E1vel", -1, 1],
        ["\u00EDvel", -1, 1],
        ["ico", -1, 1],
        ["ismo", -1, 1],
        ["oso", -1, 1],
        ["amento", -1, 1],
        ["imento", -1, 1],
        ["ivo", -1, 8],
        ["a\u00E7a~o", -1, 1],
        ["u\u00E7a~o", -1, 3],
        ["ador", -1, 1],
        ["icas", -1, 1],
        ["\u00EAncias", -1, 4],
        ["logias", -1, 2],
        ["iras", -1, 9],
        ["adoras", -1, 1],
        ["osas", -1, 1],
        ["istas", -1, 1],
        ["ivas", -1, 8],
        ["ezas", -1, 1],
        ["idades", -1, 7],
        ["adores", -1, 1],
        ["antes", -1, 1],
        ["a\u00E7o~es", -1, 1],
        ["u\u00E7o~es", -1, 3],
        ["icos", -1, 1],
        ["ismos", -1, 1],
        ["osos", -1, 1],
        ["amentos", -1, 1],
        ["imentos", -1, 1],
        ["ivos", -1, 8]
    ];

    /** @const */ var a_6 = [
        ["ada", -1, 1],
        ["ida", -1, 1],
        ["ia", -1, 1],
        ["aria", 2, 1],
        ["eria", 2, 1],
        ["iria", 2, 1],
        ["ara", -1, 1],
        ["era", -1, 1],
        ["ira", -1, 1],
        ["ava", -1, 1],
        ["asse", -1, 1],
        ["esse", -1, 1],
        ["isse", -1, 1],
        ["aste", -1, 1],
        ["este", -1, 1],
        ["iste", -1, 1],
        ["ei", -1, 1],
        ["arei", 16, 1],
        ["erei", 16, 1],
        ["irei", 16, 1],
        ["am", -1, 1],
        ["iam", 20, 1],
        ["ariam", 21, 1],
        ["eriam", 21, 1],
        ["iriam", 21, 1],
        ["aram", 20, 1],
        ["eram", 20, 1],
        ["iram", 20, 1],
        ["avam", 20, 1],
        ["em", -1, 1],
        ["arem", 29, 1],
        ["erem", 29, 1],
        ["irem", 29, 1],
        ["assem", 29, 1],
        ["essem", 29, 1],
        ["issem", 29, 1],
        ["ado", -1, 1],
        ["ido", -1, 1],
        ["ando", -1, 1],
        ["endo", -1, 1],
        ["indo", -1, 1],
        ["ara~o", -1, 1],
        ["era~o", -1, 1],
        ["ira~o", -1, 1],
        ["ar", -1, 1],
        ["er", -1, 1],
        ["ir", -1, 1],
        ["as", -1, 1],
        ["adas", 47, 1],
        ["idas", 47, 1],
        ["ias", 47, 1],
        ["arias", 50, 1],
        ["erias", 50, 1],
        ["irias", 50, 1],
        ["aras", 47, 1],
        ["eras", 47, 1],
        ["iras", 47, 1],
        ["avas", 47, 1],
        ["es", -1, 1],
        ["ardes", 58, 1],
        ["erdes", 58, 1],
        ["irdes", 58, 1],
        ["ares", 58, 1],
        ["eres", 58, 1],
        ["ires", 58, 1],
        ["asses", 58, 1],
        ["esses", 58, 1],
        ["isses", 58, 1],
        ["astes", 58, 1],
        ["estes", 58, 1],
        ["istes", 58, 1],
        ["is", -1, 1],
        ["ais", 71, 1],
        ["eis", 71, 1],
        ["areis", 73, 1],
        ["ereis", 73, 1],
        ["ireis", 73, 1],
        ["\u00E1reis", 73, 1],
        ["\u00E9reis", 73, 1],
        ["\u00EDreis", 73, 1],
        ["\u00E1sseis", 73, 1],
        ["\u00E9sseis", 73, 1],
        ["\u00EDsseis", 73, 1],
        ["\u00E1veis", 73, 1],
        ["\u00EDeis", 73, 1],
        ["ar\u00EDeis", 84, 1],
        ["er\u00EDeis", 84, 1],
        ["ir\u00EDeis", 84, 1],
        ["ados", -1, 1],
        ["idos", -1, 1],
        ["amos", -1, 1],
        ["\u00E1ramos", 90, 1],
        ["\u00E9ramos", 90, 1],
        ["\u00EDramos", 90, 1],
        ["\u00E1vamos", 90, 1],
        ["\u00EDamos", 90, 1],
        ["ar\u00EDamos", 95, 1],
        ["er\u00EDamos", 95, 1],
        ["ir\u00EDamos", 95, 1],
        ["emos", -1, 1],
        ["aremos", 99, 1],
        ["eremos", 99, 1],
        ["iremos", 99, 1],
        ["\u00E1ssemos", 99, 1],
        ["\u00EAssemos", 99, 1],
        ["\u00EDssemos", 99, 1],
        ["imos", -1, 1],
        ["armos", -1, 1],
        ["ermos", -1, 1],
        ["irmos", -1, 1],
        ["\u00E1mos", -1, 1],
        ["ar\u00E1s", -1, 1],
        ["er\u00E1s", -1, 1],
        ["ir\u00E1s", -1, 1],
        ["eu", -1, 1],
        ["iu", -1, 1],
        ["ou", -1, 1],
        ["ar\u00E1", -1, 1],
        ["er\u00E1", -1, 1],
        ["ir\u00E1", -1, 1]
    ];

    /** @const */ var a_7 = [
        ["a", -1, 1],
        ["i", -1, 1],
        ["o", -1, 1],
        ["os", -1, 1],
        ["\u00E1", -1, 1],
        ["\u00ED", -1, 1],
        ["\u00F3", -1, 1]
    ];

    /** @const */ var a_8 = [
        ["e", -1, 1],
        ["\u00E7", -1, 2],
        ["\u00E9", -1, 1],
        ["\u00EA", -1, 1]
    ];

    /** @const */ var /** Array<int> */ g_v = [17, 65, 16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 19, 12, 2];

    var /** number */ I_p2 = 0;
    var /** number */ I_p1 = 0;
    var /** number */ I_pV = 0;


    /** @return {boolean} */
    function r_prelude() {
        var /** number */ among_var;
        while(true)
        {
            var /** number */ v_1 = base.cursor;
            lab0: {
                base.bra = base.cursor;
                among_var = base.find_among(a_0);
                if (among_var == 0)
                {
                    break lab0;
                }
                base.ket = base.cursor;
                switch (among_var) {
                    case 1:
                        if (!base.slice_from("a~"))
                        {
                            return false;
                        }
                        break;
                    case 2:
                        if (!base.slice_from("o~"))
                        {
                            return false;
                        }
                        break;
                    case 3:
                        if (base.cursor >= base.limit)
                        {
                            break lab0;
                        }
                        base.cursor++;
                        break;
                }
                continue;
            }
            base.cursor = v_1;
            break;
        }
        return true;
    };

    /** @return {boolean} */
    function r_mark_regions() {
        I_pV = base.limit;
        I_p1 = base.limit;
        I_p2 = base.limit;
        var /** number */ v_1 = base.cursor;
        lab0: {
            lab1: {
                var /** number */ v_2 = base.cursor;
                lab2: {
                    if (!(base.in_grouping(g_v, 97, 250)))
                    {
                        break lab2;
                    }
                    lab3: {
                        var /** number */ v_3 = base.cursor;
                        lab4: {
                            if (!(base.out_grouping(g_v, 97, 250)))
                            {
                                break lab4;
                            }
                            golab5: while(true)
                            {
                                lab6: {
                                    if (!(base.in_grouping(g_v, 97, 250)))
                                    {
                                        break lab6;
                                    }
                                    break golab5;
                                }
                                if (base.cursor >= base.limit)
                                {
                                    break lab4;
                                }
                                base.cursor++;
                            }
                            break lab3;
                        }
                        base.cursor = v_3;
                        if (!(base.in_grouping(g_v, 97, 250)))
                        {
                            break lab2;
                        }
                        golab7: while(true)
                        {
                            lab8: {
                                if (!(base.out_grouping(g_v, 97, 250)))
                                {
                                    break lab8;
                                }
                                break golab7;
                            }
                            if (base.cursor >= base.limit)
                            {
                                break lab2;
                            }
                            base.cursor++;
                        }
                    }
                    break lab1;
                }
                base.cursor = v_2;
                if (!(base.out_grouping(g_v, 97, 250)))
                {
                    break lab0;
                }
                lab9: {
                    var /** number */ v_6 = base.cursor;
                    lab10: {
                        if (!(base.out_grouping(g_v, 97, 250)))
                        {
                            break lab10;
                        }
                        golab11: while(true)
                        {
                            lab12: {
                                if (!(base.in_grouping(g_v, 97, 250)))
                                {
                                    break lab12;
                                }
                                break golab11;
                            }
                            if (base.cursor >= base.limit)
                            {
                                break lab10;
                            }
                            base.cursor++;
                        }
                        break lab9;
                    }
                    base.cursor = v_6;
                    if (!(base.in_grouping(g_v, 97, 250)))
                    {
                        break lab0;
                    }
                    if (base.cursor >= base.limit)
                    {
                        break lab0;
                    }
                    base.cursor++;
                }
            }
            I_pV = base.cursor;
        }
        base.cursor = v_1;
        var /** number */ v_8 = base.cursor;
        lab13: {
            golab14: while(true)
            {
                lab15: {
                    if (!(base.in_grouping(g_v, 97, 250)))
                    {
                        break lab15;
                    }
                    break golab14;
                }
                if (base.cursor >= base.limit)
                {
                    break lab13;
                }
                base.cursor++;
            }
            golab16: while(true)
            {
                lab17: {
                    if (!(base.out_grouping(g_v, 97, 250)))
                    {
                        break lab17;
                    }
                    break golab16;
                }
                if (base.cursor >= base.limit)
                {
                    break lab13;
                }
                base.cursor++;
            }
            I_p1 = base.cursor;
            golab18: while(true)
            {
                lab19: {
                    if (!(base.in_grouping(g_v, 97, 250)))
                    {
                        break lab19;
                    }
                    break golab18;
                }
                if (base.cursor >= base.limit)
                {
                    break lab13;
                }
                base.cursor++;
            }
            golab20: while(true)
            {
                lab21: {
                    if (!(base.out_grouping(g_v, 97, 250)))
                    {
                        break lab21;
                    }
                    break golab20;
                }
                if (base.cursor >= base.limit)
                {
                    break lab13;
                }
                base.cursor++;
            }
            I_p2 = base.cursor;
        }
        base.cursor = v_8;
        return true;
    };

    /** @return {boolean} */
    function r_postlude() {
        var /** number */ among_var;
        while(true)
        {
            var /** number */ v_1 = base.cursor;
            lab0: {
                base.bra = base.cursor;
                among_var = base.find_among(a_1);
                if (among_var == 0)
                {
                    break lab0;
                }
                base.ket = base.cursor;
                switch (among_var) {
                    case 1:
                        if (!base.slice_from("\u00E3"))
                        {
                            return false;
                        }
                        break;
                    case 2:
                        if (!base.slice_from("\u00F5"))
                        {
                            return false;
                        }
                        break;
                    case 3:
                        if (base.cursor >= base.limit)
                        {
                            break lab0;
                        }
                        base.cursor++;
                        break;
                }
                continue;
            }
            base.cursor = v_1;
            break;
        }
        return true;
    };

    /** @return {boolean} */
    function r_RV() {
        if (!(I_pV <= base.cursor))
        {
            return false;
        }
        return true;
    };

    /** @return {boolean} */
    function r_R1() {
        if (!(I_p1 <= base.cursor))
        {
            return false;
        }
        return true;
    };

    /** @return {boolean} */
    function r_R2() {
        if (!(I_p2 <= base.cursor))
        {
            return false;
        }
        return true;
    };

    /** @return {boolean} */
    function r_standard_suffix() {
        var /** number */ among_var;
        base.ket = base.cursor;
        among_var = base.find_among_b(a_5);
        if (among_var == 0)
        {
            return false;
        }
        base.bra = base.cursor;
        switch (among_var) {
            case 1:
                if (!r_R2())
                {
                    return false;
                }
                if (!base.slice_del())
                {
                    return false;
                }
                break;
            case 2:
                if (!r_R2())
                {
                    return false;
                }
                if (!base.slice_from("log"))
                {
                    return false;
                }
                break;
            case 3:
                if (!r_R2())
                {
                    return false;
                }
                if (!base.slice_from("u"))
                {
                    return false;
                }
                break;
            case 4:
                if (!r_R2())
                {
                    return false;
                }
                if (!base.slice_from("ente"))
                {
                    return false;
                }
                break;
            case 5:
                if (!r_R1())
                {
                    return false;
                }
                if (!base.slice_del())
                {
                    return false;
                }
                var /** number */ v_1 = base.limit - base.cursor;
                lab0: {
                    base.ket = base.cursor;
                    among_var = base.find_among_b(a_2);
                    if (among_var == 0)
                    {
                        base.cursor = base.limit - v_1;
                        break lab0;
                    }
                    base.bra = base.cursor;
                    if (!r_R2())
                    {
                        base.cursor = base.limit - v_1;
                        break lab0;
                    }
                    if (!base.slice_del())
                    {
                        return false;
                    }
                    switch (among_var) {
                        case 1:
                            base.ket = base.cursor;
                            if (!(base.eq_s_b("at")))
                            {
                                base.cursor = base.limit - v_1;
                                break lab0;
                            }
                            base.bra = base.cursor;
                            if (!r_R2())
                            {
                                base.cursor = base.limit - v_1;
                                break lab0;
                            }
                            if (!base.slice_del())
                            {
                                return false;
                            }
                            break;
                    }
                }
                break;
            case 6:
                if (!r_R2())
                {
                    return false;
                }
                if (!base.slice_del())
                {
                    return false;
                }
                var /** number */ v_2 = base.limit - base.cursor;
                lab1: {
                    base.ket = base.cursor;
                    if (base.find_among_b(a_3) == 0)
                    {
                        base.cursor = base.limit - v_2;
                        break lab1;
                    }
                    base.bra = base.cursor;
                    if (!r_R2())
                    {
                        base.cursor = base.limit - v_2;
                        break lab1;
                    }
                    if (!base.slice_del())
                    {
                        return false;
                    }
                }
                break;
            case 7:
                if (!r_R2())
                {
                    return false;
                }
                if (!base.slice_del())
                {
                    return false;
                }
                var /** number */ v_3 = base.limit - base.cursor;
                lab2: {
                    base.ket = base.cursor;
                    if (base.find_among_b(a_4) == 0)
                    {
                        base.cursor = base.limit - v_3;
                        break lab2;
                    }
                    base.bra = base.cursor;
                    if (!r_R2())
                    {
                        base.cursor = base.limit - v_3;
                        break lab2;
                    }
                    if (!base.slice_del())
                    {
                        return false;
                    }
                }
                break;
            case 8:
                if (!r_R2())
                {
                    return false;
                }
                if (!base.slice_del())
                {
                    return false;
                }
                var /** number */ v_4 = base.limit - base.cursor;
                lab3: {
                    base.ket = base.cursor;
                    if (!(base.eq_s_b("at")))
                    {
                        base.cursor = base.limit - v_4;
                        break lab3;
                    }
                    base.bra = base.cursor;
                    if (!r_R2())
                    {
                        base.cursor = base.limit - v_4;
                        break lab3;
                    }
                    if (!base.slice_del())
                    {
                        return false;
                    }
                }
                break;
            case 9:
                if (!r_RV())
                {
                    return false;
                }
                if (!(base.eq_s_b("e")))
                {
                    return false;
                }
                if (!base.slice_from("ir"))
                {
                    return false;
                }
                break;
        }
        return true;
    };

    /** @return {boolean} */
    function r_verb_suffix() {
        if (base.cursor < I_pV)
        {
            return false;
        }
        var /** number */ v_2 = base.limit_backward;
        base.limit_backward = I_pV;
        base.ket = base.cursor;
        if (base.find_among_b(a_6) == 0)
        {
            base.limit_backward = v_2;
            return false;
        }
        base.bra = base.cursor;
        if (!base.slice_del())
        {
            return false;
        }
        base.limit_backward = v_2;
        return true;
    };

    /** @return {boolean} */
    function r_residual_suffix() {
        base.ket = base.cursor;
        if (base.find_among_b(a_7) == 0)
        {
            return false;
        }
        base.bra = base.cursor;
        if (!r_RV())
        {
            return false;
        }
        if (!base.slice_del())
        {
            return false;
        }
        return true;
    };

    /** @return {boolean} */
    function r_residual_form() {
        var /** number */ among_var;
        base.ket = base.cursor;
        among_var = base.find_among_b(a_8);
        if (among_var == 0)
        {
            return false;
        }
        base.bra = base.cursor;
        switch (among_var) {
            case 1:
                if (!r_RV())
                {
                    return false;
                }
                if (!base.slice_del())
                {
                    return false;
                }
                base.ket = base.cursor;
                lab0: {
                    var /** number */ v_1 = base.limit - base.cursor;
                    lab1: {
                        if (!(base.eq_s_b("u")))
                        {
                            break lab1;
                        }
                        base.bra = base.cursor;
                        var /** number */ v_2 = base.limit - base.cursor;
                        if (!(base.eq_s_b("g")))
                        {
                            break lab1;
                        }
                        base.cursor = base.limit - v_2;
                        break lab0;
                    }
                    base.cursor = base.limit - v_1;
                    if (!(base.eq_s_b("i")))
                    {
                        return false;
                    }
                    base.bra = base.cursor;
                    var /** number */ v_3 = base.limit - base.cursor;
                    if (!(base.eq_s_b("c")))
                    {
                        return false;
                    }
                    base.cursor = base.limit - v_3;
                }
                if (!r_RV())
                {
                    return false;
                }
                if (!base.slice_del())
                {
                    return false;
                }
                break;
            case 2:
                if (!base.slice_from("c"))
                {
                    return false;
                }
                break;
        }
        return true;
    };

    this.stem = /** @return {boolean} */ function() {
        var /** number */ v_1 = base.cursor;
        r_prelude();
        base.cursor = v_1;
        r_mark_regions();
        base.limit_backward = base.cursor; base.cursor = base.limit;
        var /** number */ v_3 = base.limit - base.cursor;
        lab0: {
            lab1: {
                var /** number */ v_4 = base.limit - base.cursor;
                lab2: {
                    var /** number */ v_5 = base.limit - base.cursor;
                    lab3: {
                        var /** number */ v_6 = base.limit - base.cursor;
                        lab4: {
                            if (!r_standard_suffix())
                            {
                                break lab4;
                            }
                            break lab3;
                        }
                        base.cursor = base.limit - v_6;
                        if (!r_verb_suffix())
                        {
                            break lab2;
                        }
                    }
                    base.cursor = base.limit - v_5;
                    var /** number */ v_7 = base.limit - base.cursor;
                    lab5: {
                        base.ket = base.cursor;
                        if (!(base.eq_s_b("i")))
                        {
                            break lab5;
                        }
                        base.bra = base.cursor;
                        var /** number */ v_8 = base.limit - base.cursor;
                        if (!(base.eq_s_b("c")))
                        {
                            break lab5;
                        }
                        base.cursor = base.limit - v_8;
                        if (!r_RV())
                        {
                            break lab5;
                        }
                        if (!base.slice_del())
                        {
                            return false;
                        }
                    }
                    base.cursor = base.limit - v_7;
                    break lab1;
                }
                base.cursor = base.limit - v_4;
                if (!r_residual_suffix())
                {
                    break lab0;
                }
            }
        }
        base.cursor = base.limit - v_3;
        var /** number */ v_9 = base.limit - base.cursor;
        r_residual_form();
        base.cursor = base.limit - v_9;
        base.cursor = base.limit_backward;
        var /** number */ v_10 = base.cursor;
        r_postlude();
        base.cursor = v_10;
        return true;
    };

    /**@return{string}*/
    this['stemWord'] = function(/**string*/word) {
        base.setCurrent(word);
        this.stem();
        return base.getCurrent();
    };
};

Stemmer = PortugueseStemmer;
