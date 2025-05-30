from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service as ChromeService
from webdriver_manager.chrome import ChromeDriverManager
from selenium.common.exceptions import TimeoutException
import time

# --- Configurações Globais ---
class Config:
    INITIAL_URL = "http://localhost:3000/i/fabrication-monitoring"
    TARGET_URL_AFTER_CLICK = "http://localhost:3000/i/fabrication-monitoring/HP-10222"
    USER_EMAIL = "rodrigo.roli@harrispye.com".strip()
    USER_PASSWORD = "HPB2025"

    # XPaths para Login (movidos para LoginPage)
    # XPaths para ações principais (movidos para FabricationMonitoringPage)

    DEFAULT_TIMEOUT = 10
    LONG_TIMEOUT = 30
    SHORT_TIMEOUT = 5

# --- Classe Base para Páginas (BasePage) ---
class BasePage:
    """
    Contém métodos comuns para interagir com elementos da página.
    Todas as classes de página específicas herdarão desta.
    """
    def __init__(self, driver):
        self.driver = driver

    def _find_element(self, by, value, timeout=Config.DEFAULT_TIMEOUT):
        """Encontra e retorna um elemento visível."""
        return WebDriverWait(self.driver, timeout).until(
            EC.visibility_of_element_located((by, value))
        )

    def _find_clickable_element(self, by, value, timeout=Config.DEFAULT_TIMEOUT):
        """Encontra e retorna um elemento clicável."""
        return WebDriverWait(self.driver, timeout).until(
            EC.element_to_be_clickable((by, value))
        )

    def _send_keys_to_element(self, by, value, text, timeout=Config.DEFAULT_TIMEOUT):
        """Limpa um campo e envia texto para ele."""
        element = self._find_element(by, value, timeout)
        element.clear()
        element.send_keys(text)

    def _click_element(self, by, value, timeout=Config.DEFAULT_TIMEOUT):
        """Clica em um elemento."""
        element = self._find_clickable_element(by, value, timeout)
        element.click()

    def get_current_url(self):
        """Retorna a URL atual."""
        return self.driver.current_url

    def wait_for_url_to_be(self, url, timeout=Config.DEFAULT_TIMEOUT):
        """Espera até que a URL atual seja a URL especificada."""
        return WebDriverWait(self.driver, timeout).until(EC.url_to_be(url))

    def wait_for_element_to_disappear(self, by, value, timeout=Config.DEFAULT_TIMEOUT):
        """Espera até que um elemento não esteja mais visível."""
        return WebDriverWait(self.driver, timeout).until_not(
            EC.visibility_of_element_located((by, value))
        )

    def is_element_visible(self, by, value, timeout=Config.SHORT_TIMEOUT):
        """Verifica se um elemento está visível dentro de um timeout curto."""
        try:
            self._find_element(by, value, timeout)
            return True
        except TimeoutException:
            return False

    def navigate_to_url(self, url):
        """Navega para uma URL e espera o carregamento da página."""
        self.driver.get(url)
        WebDriverWait(self.driver, Config.DEFAULT_TIMEOUT).until(
            lambda d: d.execute_script('return document.readyState') == 'complete'
        )
        print(f"Navegado para: {url}. URL atual: {self.get_current_url()}")


# --- Classe da Página de Login (LoginPage) ---
class LoginPage(BasePage):
    # Localizadores dos elementos da página de login
    EMAIL_INPUT = (By.XPATH, "/html/body/div/div/div/div[2]/div/div[2]/form/div/div[1]/div[1]/input")
    PASSWORD_INPUT = (By.XPATH, "/html/body/div/div/div/div[2]/div/div[2]/form/div/div[1]/div[2]/input")
    SUBMIT_BUTTON = (By.XPATH, "/html/body/div/div/div/div[2]/div/div[2]/form/div/button")

    def __init__(self, driver):
        super().__init__(driver)

    def _enter_email(self, email):
        self._send_keys_to_element(*self.EMAIL_INPUT, text=email)
        print(f"Email '{email}' inserido.")

    def _enter_password(self, password):
        self._send_keys_to_element(*self.PASSWORD_INPUT, text=password)
        print("Senha inserida.")

    def _click_submit(self):
        self._click_element(*self.SUBMIT_BUTTON)
        print("Botão de login clicado.")

    def perform_login(self, email, password, expected_url_after_login):
        """Executa a sequência de login completa."""
        print("Tentando realizar o login...")
        self._enter_email(email)
        self._enter_password(password)
        self._click_submit()
        
        print(f"Aguardando confirmação do login. Esperando URL ser '{expected_url_after_login}' ou formulário desaparecer...")
        try:
            self.wait_for_url_to_be(expected_url_after_login, timeout=15) # Espera um pouco mais pelo redirecionamento
            print(f"Login bem-sucedido. URL atual: {self.get_current_url()}")
        except TimeoutException:
            print(f"URL não mudou para '{expected_url_after_login}' em 15s. Verificando se formulário de login desapareceu...")
            self.wait_for_element_to_disappear(*self.EMAIL_INPUT, timeout=10)
            print("Formulário de login desapareceu. Assumindo login bem-sucedido.")
            if self.get_current_url() != expected_url_after_login:
                print(f"URL atual é {self.get_current_url()}, navegando para {expected_url_after_login}")
                self.navigate_to_url(expected_url_after_login)
    
    def is_login_form_present(self):
        """Verifica se o formulário de login (campo de email) está presente."""
        return self.is_element_visible(*self.EMAIL_INPUT)

# --- Classe da Página de Monitoramento de Fabricação (FabricationMonitoringPage) ---
class FabricationMonitoringPage(BasePage):
    # Localizadores dos elementos da página
    BUTTON_1 = (By.XPATH, "/html/body/div/div/main/div[2]/div/div[2]/div/table/tbody/tr[1]/td[7]/button")
    BUTTON_2 = (By.XPATH, "/html/body/div[2]/div/div[3]/div[1]") # Este XPath pode ser de um modal/popup
    BUTTON_ADD_ROW = (By.XPATH, "/html/body/div/div/main/div[2]/div/div[3]/div[2]/div/div[1]/div/button[1]]") 
    BUTTON_EDIT_TOOGLE = (By.XPATH, "/html/body/div/div/main/div[2]/div/div[3]/div[2]/div/div[1]/div/button[2]")
    DRAWING_REF_COMBOBOX = { 
        "inital_button" :(By.XPATH,"/html/body/div/div/main/div[2]/div/div[3]/div[2]/div/div[2]/div/table/tbody/tr[1]/td[2]/button"),
        "searc_input":(By.XPATH,"/html/body/div[2]/div/div/div[1]/input")
    }
    INPUT_SPOOL_NUMBER = (By.XPATH,"/html/body/div/div/main/div[2]/div/div[3]/div[2]/div/div[2]/div/table/tbody/tr[1]/td[3]/div/input")
    INPUT_DESCRIPTION = (By.XPATH,"/html/body/div/div/main/div[2]/div/div[3]/div[2]/div/div[2]/div/table/tbody/tr[1]/td[4]/div/input")
    def __init__(self, driver):
        super().__init__(driver)

    def click_first_main_button(self):
        print(f"Tentando clicar no primeiro botão principal: {self.BUTTON_1[1]}")
        self._click_element(*self.BUTTON_1, timeout=Config.LONG_TIMEOUT)
        print("Primeiro botão principal clicado.")

    def click_second_main_button(self):
        """
        Clica no segundo botão. Atenção: Se este botão aparece em um modal
        após o primeiro clique, a interação pode precisar de tratamento especial
        (ex: esperar o modal ficar visível).
        """
        print(f"Tentando clicar no segundo elemento/botão: {self.BUTTON_2[1]}")
        self._click_element(*self.BUTTON_2, timeout=Config.LONG_TIMEOUT)
        print("Segundo elemento/botão clicado.")
        # Adicionar uma linha
        # todos os inputs /select
    def verify_navigation_to_target_url(self, target_url):
        print(f"Aguardando a navegação para a URL: {target_url}")
        try:
            self.wait_for_url_to_be(target_url, timeout=Config.LONG_TIMEOUT)
            print(f"Página {target_url} acessada com sucesso!")
            current_url = self.get_current_url()
            if current_url == target_url:
                print(f"Verificação final: A URL atual ({current_url}) corresponde à URL esperada.")
            else:
                print(f"ALERTA: A URL atual ({current_url}) é diferente da URL esperada ({target_url}) mesmo após a condição de espera.")
        except TimeoutException:
            print(f"ERRO: Timeout ao esperar pela URL {target_url}. URL atual: {self.get_current_url()}")
            raise # Re-lança a exceção para que o script principal saiba que falhou

# --- Fluxo Principal da Automação ---
def main_automation_workflow():
    print("Iniciando o fluxo de automação...")
    driver = None
    try:
        print("Configurando o WebDriver...")
        driver_service = ChromeService(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=driver_service)
        print("WebDriver configurado com sucesso.")

        # Instanciando as páginas
        login_page = LoginPage(driver)
        fab_monitoring_page = FabricationMonitoringPage(driver)

        # 1. Navegar para a URL inicial
        fab_monitoring_page.navigate_to_url(Config.INITIAL_URL)

        # 2. Verificar e realizar login se necessário
        if login_page.is_login_form_present():
            print("Formulário de login detectado.")
            login_page.perform_login(Config.USER_EMAIL, Config.USER_PASSWORD, Config.INITIAL_URL)
            
            # Garantir que estamos na URL inicial após a tentativa de login
            if fab_monitoring_page.get_current_url() != Config.INITIAL_URL:
                print(f"URL atual ({fab_monitoring_page.get_current_url()}) não é a inicial. Navegando para {Config.INITIAL_URL}.")
                fab_monitoring_page.navigate_to_url(Config.INITIAL_URL)
        else:
            print("Formulário de login não detectado. Assumindo que já está logado.")
            if fab_monitoring_page.get_current_url() != Config.INITIAL_URL:
                print(f"Apesar de não haver login, URL atual ({fab_monitoring_page.get_current_url()}) não é a inicial. Navegando para {Config.INITIAL_URL}.")
                fab_monitoring_page.navigate_to_url(Config.INITIAL_URL)
        
        print(f"Pronto para interagir com a página: {Config.INITIAL_URL}")

        # 3. Realizar ações na página de Monitoramento de Fabricação
        fab_monitoring_page.click_first_main_button()
        fab_monitoring_page.click_second_main_button() # Se este botão depende do estado após o primeiro clique, certifique-se de que a página está pronta.

        # 4. Verificar a navegação para a URL final
        fab_monitoring_page.verify_navigation_to_target_url(Config.TARGET_URL_AFTER_CLICK)

        print("Fluxo de automação concluído com sucesso!")

    except TimeoutException as te:
        print(f"ERRO CRÍTICO (Timeout): {te}")
        if driver: print(f"URL no momento do Timeout: {driver.current_url}")
    except Exception as e:
        print(f"ERRO CRÍTICO (Geral): {e}")
        if driver: print(f"URL no momento do erro: {driver.current_url}")
    finally:
        if driver:
            # print("Mantendo o navegador aberto por 15 segundos para depuração...")
            # time.sleep(15)
            driver.quit()
            print("Navegador fechado.")

if __name__ == "__main__":
    main_automation_workflow()