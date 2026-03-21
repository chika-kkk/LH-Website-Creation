function kintoneDataTransmission() {

	const formData =
	{
		姓: $("#familyNameInput").val(),
		名: $("#firstNameInput").val(),
		姓カナ: $("#familyNameKanaInput").val(),
		名カナ: $("#firstNameKanaInput").val(),

		郵便番号: $("#addressInput").val(),
		都道府県: $("#prefectureInput").val(),
		市区町村: $("#cityInput").val(),
		番地: $("#streetInput").val(),
		建物名_お部屋番号: $("#buildingInput").val(),

		メールアドレス: $("#mailInput").val(),
		電話番号: $("#phoneInput").val(),
		お問い合わせ種別: $("input[name='inquiryType']:checked").val(),
		お問い合わせ内容: $("#inquiryContentInput").val(),
	};


	fetch("http://host:3000/submit", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(formData)
	})
		.then(response => {
			if (response.ok) {
				window.location.href = "LH_inquiryForm_completionForm.html";
				return response.json();
			}
			console.error("送信失敗");
			console.error(response);
		});
}

$(function () {

	// 独自ルール
	let methods = {

		kana: function (value, element) {
			return (
				this.optional(element) ||
				/^[a-zA-Z]+$/.test(value)
			);
		},
		mail: function (value, element) {
			return (
				this.optional(element) ||
				/^[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+(\.[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+)*@([a-zA-Z0-9]+(\-[a-zA-Z0-9]+)*\.)*[a-zA-Z]{2,}$/.test(value)
			);
		},

		hwDigits: function (value, element) {
			return (
				this.optional(element) ||
				/^[0-9]+$/.test(value)
			);
		},

	};

	$.each(methods, function (key) {

		$.validator.addMethod(key, this);
	});

	const validator = $("form").validate({

		rules: {
			familyNameInput: { required: true },
			firstNameInput: { required: true },
			familyNameKanaInput: { required: true, kana: true },
			firstNameKanaInput: { required: true, kana: true },
			postCodeInput: { rangelength: [7, 7] },
			// prefectureInput: { required: true },
			// cityInput: { required: true },
			// streetInput: { required: true },
			// buildingInput: { required: true },

			mailInput: { required: true, mail: true },
			phoneInput: { required: true, hwDigits: true, rangelength: [10, 11] },

			inquiryType: { required: true, minlength: 1 },

			inquiryContentInput: { required: true },

			privacyPolicyCheckbox: { required: true, }
		},

		messages: {
			familyNameInput: { required: "お名前が未入力です" },
			firstNameInput: {
				required: 'お名前が未入力です'
			},
			familyNameKanaInput: { required: 'お名前（カナ）が未入力です', kana: '半角英字でご入力ください' },
			firstNameKanaInput: { required: 'お名前（カナ）が未入力です', kana: '半角英字でご入力ください' },

			postCodeInput: { rangelength: '7文字でご入力ください' },
			// prefectureInput: {required: '住所1（都道府県）' },
			// cityInput: {required: '住所2（市区町村）' },
			// streetInput: {required: '住所3（番地）' },
			// buildingInput: {required: '住所4（建物名、お部屋番号）' },
			// halfWidthDigits
			mailInput: { required: 'メールアドレス が未入力です', mail: '正しい形式のメールアドレスを入力してください' },
			phoneInput: { required: '電話番号 が未入力です', hwDigits: '半角数字で入力してください', rangelength: '10~11文字でご入力ください' },

			inquiryType: { required: 'お問い合わせ種別 が選択されていません', minlength: 'お問い合わせ種別 が選択されていません' },
			inquiryContentInput: { required: 'お問い合わせ内容 が未入力です' },

			privacyPolicyCheckbox: { required: 'プライバシーポリシーの同意が必要です' },



		},
		groups: {
			nameGroup: "familyNameInput firstNameInput",
			kanaGroup: "familyNameKanaInput firstNameKanaInput"
		},

		errorElement: "span",
		errorClass: "error",
		errorPlacement: function (error, element) {

			if (element.hasClass("privacyPolicyCheckbox")) {
				error.appendTo(element.parent().next(".errorMessageArea"));
				return;
			}
			if (element.attr("class") === "radioArea") {
				error.appendTo($(".radioArea"));
				return;
			}
			if (element.hasClass("familyNameInput") || element.hasClass("firstNameInput")) {
				error.appendTo(element.closest(".InputSpacing").find(".errorMessageArea"));
				return;
			}
			if (element.hasClass("familyNameKanaInput") || element.hasClass("firstNameKanaInput")) {
				error.appendTo(element.closest(".InputSpacing").find(".errorMessageArea"));
				return;
			}
			error.appendTo(element.closest(".InputGroup").find(".errorMessageArea"));
			// console.log("element");
		},


		submitHandler:
			function () {
				kintoneDataTransmission();
			},
	});

});