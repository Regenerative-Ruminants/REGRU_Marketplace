FROM debian:bookworm

ARG USER=developer
ARG DEBIAN_FRONTEND=noninteractive
RUN apt update \
    && apt install -y --no-install-recommends sudo git zsh curl wget ca-certificates unzip \
    && apt clean \
    && apt autoremove -y \
    && rm -rf /var/lib/apt/lists/*

RUN useradd -m -s /usr/bin/zsh ${USER} \
    && echo "${USER} ALL=(ALL) NOPASSWD: ALL" >/etc/sudoers.d/${USER} \
    && chmod 0440 /etc/sudoers.d/${USER}


USER ${USER}
ARG HOME=/home/${USER}
ARG ZSH=${HOME}/.oh-my-zsh
ARG ZSH_CUSTOM=${ZSH}/custom
WORKDIR ${HOME}


RUN <<EOT
    sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
    mkdir -p ${ZSH_CUSTOM}
    git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM}/plugins/zsh-autosuggestions
    git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM}/plugins/zsh-syntax-highlighting
    sed -i.bak 's/plugins=(\(.*\))/plugins=(\1 zsh-autosuggestions zsh-syntax-highlighting)/' ~/.zshrc
EOT


ARG SPACESHIP_REMOTE=https://github.com/spaceship-prompt/spaceship-prompt.git
RUN <<EOT
    git clone ${SPACESHIP_REMOTE} ${ZSH_CUSTOM}/themes/spaceship-prompt --depth=1
    ln -s ${ZSH_CUSTOM}/themes/spaceship-prompt/spaceship.zsh-theme ${ZSH_CUSTOM}/themes/spaceship.zsh-theme
    sed -i 's|ZSH_THEME="robbyrussell"|ZSH_THEME="spaceship"|g' .zshrc
EOT


RUN <<EOT
    curl -LsSf https://astral.sh/uv/install.sh | sh
    echo 'eval "$(uv generate-shell-completion zsh)"' >> ~/.zshrc
    echo 'eval "$(uvx --generate-shell-completion zsh)"' >> ~/.zshrc
EOT


# Define a variable for the release URL and file name
ARG AUTONOMI_ZIP_URL="https://github.com/maidsafe/autonomi/releases/download/stable-2025.7.1.5/2025.7.1.5.autonomi.x86_64-unknown-linux-musl.zip"
ARG AUTONOMI_ZIP_FILE="2025.7.1.5.autonomi.x86_64-unknown-linux-musl.zip"
ARG AUTONOMI_BINARY_NAME="ant"

# Download the zip file
RUN curl -L -o /tmp/${AUTONOMI_ZIP_FILE} ${AUTONOMI_ZIP_URL}

# Create a temporary directory for extraction
RUN mkdir -p /tmp/autonomi_extract

# Extract the zip file to the temporary directory
# The `unzip -j` option "junk paths" - extracts all files into the extraction directory,
# ignoring the directory structure inside the zip. This is useful if the binary is
# nested within folders in the zip.
RUN unzip -j /tmp/${AUTONOMI_ZIP_FILE} -d /tmp/autonomi_extract

# Find the binary (assuming its name is 'autonomi') and move it to /usr/local/bin
# /usr/local/bin is already in the system's PATH.
RUN find /tmp/autonomi_extract -name "${AUTONOMI_BINARY_NAME}" -exec mv {} /home/developer/.local/bin/ \;
RUN chmod +x /home/developer/.local/bin/${AUTONOMI_BINARY_NAME}

# Clean up downloaded zip and extracted directory to reduce image size
RUN rm -rf /tmp/${AUTONOMI_ZIP_FILE} /tmp/autonomi_extract
